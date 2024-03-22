export interface User {
  readonly _id: string
  firstName: string
  lastName: string
  email: string
  role: string
  readonly createdAt: string
  readonly updatedAt: string
}
