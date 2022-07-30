import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client'
import useAuth from '@hooks/useAuth'
import useFormInput from '@hooks/useFormInput'
import { GetServerSideProps, GetServerSidePropsContext } from 'next/types'
import React, { useEffect } from 'react'

const CREATE_SCRIM = gql`
  mutation createScrim($scrim: CreateScrimInput) {
    createScrim(scrim: $scrim) {
      id
      date
      duration
      teams {
        team {
          name
        }
      }
    }
  }
`

const GET_SCRIMS = gql`
  {
    scrims {
      id
      booked
      game {
        name
      }
      teams {
        team {
          name
        }
      }
    }
  }
`

const GET_GAMES_AND_TEAMS = gql`
  query GamesAndTeams($id: String!) {
    games {
      id
      name
    }
    myTeams(id: $id) {
      teams {
        team {
          id
          name
        }
      }
    }
  }
`

// const MY_TEAMS = gql`
//   query MyTeams($id: String!) {
//     myTeams(id: $id) {
//       teams {
//         team {
//           id
//           name
//         }
//       }
//     }
//   }
// `

const RequestScrim = () => {
  const auth = useAuth()
  if (auth.isLoading) return null
  const [createScrim, { loading, error, data }] = useMutation(CREATE_SCRIM)
  const [getScrims, { loading: scrimsLoading, error: scrimsError, data: scrims }] = useLazyQuery(GET_SCRIMS)
  const {
    loading: gamesLoading,
    error: gamesError,
    data: gamesAndTeams
  } = useQuery(GET_GAMES_AND_TEAMS, {
    variables: {
      id: auth.user.id
    }
  })

  console.log(auth)
  const dateInput = useFormInput()
  const durationInput = useFormInput(60)
  const gameInput = useFormInput()
  const teamInput = useFormInput()

  if (gamesError) console.error(gamesError)
  if (!gamesLoading) console.log(gamesAndTeams)

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    const scrimData = {
      date: new Date(dateInput.value).toISOString(),
      duration: parseInt(durationInput.value),
      gameId: gameInput.value,
      teamId: teamInput.value
    }

    console.log(scrimData)
    const scrim = await createScrim({
      variables: {
        scrim: scrimData
      }
    })

    console.log(scrim)
  }

  useEffect(() => {
    if (!gamesLoading) {
      gameInput.setValue(gamesAndTeams.games[0].id)
      teamInput.setValue(gamesAndTeams.myTeams.teams[0].team.id)
    }
  }, [gamesLoading])

  return (
    <div>
      <h1>Request a scrim</h1>

      <form action='#' method='POST' onSubmit={handleSubmit}>
        <input type='datetime-local' required {...dateInput} />
        <select required {...durationInput}>
          <option value='60'>1 hour</option>
          <option value='120'>2 hours</option>
        </select>

        {!gamesLoading && (
          <>
            <select required {...gameInput}>
              {gamesAndTeams?.games?.map((game) => (
                <option key={game.id} value={game.id}>
                  {game.name}
                </option>
              ))}
            </select>

            <select required {...teamInput}>
              {gamesAndTeams?.myTeams?.teams?.map((team) => (
                <option key={team.team.id} value={team.team.id}>
                  {team.team.name}
                </option>
              ))}
            </select>
          </>
        )}

        <button type='submit'>Create scrim</button>
      </form>
    </div>
  )
}

const withAuth = (getServerSideProps: GetServerSideProps) => {
  return async (context: GetServerSidePropsContext) => {
    const { req } = context
    const refreshToken = req?.cookies?.refreshToken

    if (!refreshToken) {
      return {
        redirect: {
          destination: '/'
        }
      }
    }

    return await getServerSideProps(context)
  }
}

export const getServerSideProps = withAuth(async () => {
  return {
    props: {}
  }
})

export default RequestScrim
