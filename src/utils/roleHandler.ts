import { HTTPException } from 'hono/http-exception'
import { createMiddleware } from 'hono/factory'

import { decode } from 'hono/jwt'

const ROLE = {
    ADMIN: 'ADMIN',
    AGENT: 'AGENT',
    CUSTOMER: 'CUSTOMER',
}

/**
 * The function `roleRouteValidation` validates the role of a user based on the JWT token payload on a specific route.
 * @param {any} value - The `value` parameter is likely an object that contains an `authorization`
 * property. This property is expected to be a string that includes a bearer token.
 * @param {string} role - The `role` parameter in the `roleRouteValidation` function is a string that represents the role of the user.
 */
const roleRouteValidation = (value: any, role: string) => {
    const token = value.authorization?.replace('Bearer ', '')
    const { header, payload } = decode(token)
    // console.log('Decoded Header:', header)
    // console.log('Decoded Payload:', payload)
    if (payload?.role !== role) {
        throw new HTTPException(401, { message: 'Unauthorized user role' })
    }
}

export const adminRoleRouteValidation = (value: Record<string, string>) =>
    roleRouteValidation(value, ROLE.ADMIN)

export const agentRoleRouteValidation = (value: Record<string, string>) =>
    roleRouteValidation(value, ROLE.AGENT)

export const customerRoleRouteValidation = (value: Record<string, string>) =>
    roleRouteValidation(value, ROLE.CUSTOMER)

/**
 * The `roleMiddleware` function decodes a token, checks if the user role matches the required role, and
 * throws an exception if not for a children routes.
 * @param {string} token - A token is a piece of data that is used to authenticate and authorize a
 * user. It is typically a string that contains encoded information about the user and their
 * permissions.
 * @param {string} role - The `role` parameter in the `roleMiddleware` function is a string that represents the role that a user.
 */
const roleMiddleware = async (token: string, role: string) => {
    const { header, payload } = decode(token)
    console.log('Decoded Header:', header)
    console.log('Decoded Payload:', payload)

    if (payload.role !== role) {
        throw new HTTPException(401, { message: 'Unauthorized user role' })
    }
}

const getBearerToken = (token: any) =>
    `${token.req.header('authorization')?.replace('Bearer ', '')}`

export const adminRoleMiddleware = createMiddleware(async (c, next) => {
    roleMiddleware(`${getBearerToken(c)}`, ROLE.ADMIN)
    await next()
})

export const agentRoleMiddleware = createMiddleware(async (c, next) => {
    roleMiddleware(`${getBearerToken(c)}`, ROLE.AGENT)
    await next()
})

export const CUSTOMERRoleMiddleware = createMiddleware(async (c, next) => {
    roleMiddleware(`${getBearerToken(c)}`, ROLE.CUSTOMER)
    await next()
})
