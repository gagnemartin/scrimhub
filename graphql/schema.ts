import { gql } from 'apollo-server-micro'

export const typeDefs = gql`
  type User {
    id: String!
    discordId: String
    displayName: String!
    epicId: String
    isAdmin: Boolean
    organisations: [MembersOnOrganisations]!
    organisationsCreated: [Organisation]!
    teams: [MembersOnTeams]!
    teamsCreated: [Team]!
    createdAt: String!
    updatedAt: String!
  }

  type Organisation {
    id: String!
    name: String!
    members: [MembersOnOrganisations]!
    createdBy: User
    createdAt: String!
    updatedAt: String!
  }

  type MembersOnOrganisations {
    organisation: Organisation!
    organisationId: String!
    user: User!
    userId: String!
    role: String!
    createdAt: String!
    updatedAt: String!
  }

  type Game {
    id: String!
    name: String!
    teams: [Team]
    createdAt: String!
    updatedAt: String!
  }

  type Team {
    id: String!
    name: String!
    members: [MembersOnTeams]
    game: Game!
    gameId: String!
    organisation: Organisation
    organisationId: String
    scrims: [ScrimsOnTeams]
    createdBy: String
    createdAt: String!
    updatedAt: String!
  }

  type MembersOnTeams {
    team: Team!
    teamId: String!
    user: User!
    userId: String!
    role: String!
    createdAt: String!
    updatedAt: String!
  }

  type Scrim {
    id: String!
    booked: Boolean!
    date: String!
    duration: Int! # in minutes (60, 120)
    game: Game!
    gameId: String!
    lobbyLogin: String
    lobbyPassword: String
    teams: [ScrimsOnTeams]
    createdAt: String!
    updatedAt: String!
  }

  type ScrimsOnTeams {
    scrim: Scrim!
    scrimId: String!
    team: Team!
    teamId: String!
    appliedAt: String!
    updatedAt: String!
  }

  type Query {
    user(id: String): User
    users: [User]!
  }
`

// model Scrim {
//   id  String @id @default(uuid())
//   booked Boolean @default(false)
//   date DateTime
//   duration Int @default(60)
//   game Game @relation(fields: [gameId], references: [id], onDelete: Cascade)
//   gameId String
//   lobbyLogin String?
//   lobbyPassword String?
//   teams ScrimsOnTeams[]
//   createdAt DateTime @default(now())
//   updatedAt DateTime @default(now())

//   @@unique([date, gameId, lobbyLogin])
// }

// model ScrimsOnTeams {
//   scrim Scrim @relation(fields: [scrimId], references: [id], onDelete: Cascade)
//   scrimId String
//   team Team @relation(fields: [teamId], references: [id], onDelete: Cascade)
//   teamId String
//   appliedAt DateTime @default(now())
//   updatedAt DateTime @default(now())

//   @@id([scrimId, teamId])
// }
