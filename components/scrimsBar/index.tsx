import { gql, useQuery } from '@apollo/client'
import { NextComponentType } from 'next'

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

const ScrimsBar: NextComponentType = () => {
  const { data, loading, error } = useQuery(GET_SCRIMS)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>
  if (data.scrims.length === 0) return <p>No scrims to show</p>

  return (
    <div>
      {data.scrims.map((scrim) => (
        <div key={scrim.id}>
          <h3>{scrim.game.name}</h3>
          <p>
            {scrim.teams[0].team.name} vs {scrim.teams[1] ? scrim.teams[1].team.name : '?'}
          </p>
        </div>
      ))}
    </div>
  )
}

export default ScrimsBar
