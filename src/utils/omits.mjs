const omitPassword = ({ password, ...userWithoutPassword }) => userWithoutPassword

const omitPasswords = users => users.map(omitPassword)

export { omitPassword, omitPasswords }
