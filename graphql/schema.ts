import { gql } from 'apollo-server-micro'

export const typeDefs = gql`
  type User {
    id: String!
    discordId: String
    displayName: String!
    email: String!
    epicId: String
    password: String!
    refreshToken: String!
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
    # user(id: String): User
    # users: [User]!
    scrims: [Scrim]!
  }

  # input CreateUserInput {
  #   displayName: String! @constraint(minLength: 2, maxLength: 30)
  #   email: String! @constraint(format: "email")
  #   password: String! @constraint(minLength: 8)
  #   passwordConfirm: String!
  # }

  # type Mutation {
  #   createUser(user: CreateUserInput): User
  #   login(email: String!, password: String!): User
  # }
`

