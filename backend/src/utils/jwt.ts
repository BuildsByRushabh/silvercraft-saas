import jwt from 'jsonwebtoken';
import config from '../config/env';

export interface JWTPayload {
    sub: string; // user ID
    tenantId: string;
    email: string;
    role: string;
}

export const generateToken = (payload: JWTPayload): string => {
    return jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
    });
};

export const generateRefreshToken = (payload: JWTPayload): string => {
    return jwt.sign(payload, config.jwt.refreshSecret, {
        expiresIn: config.jwt.refreshExpiresIn,
    });
};

export const verifyToken = (token: string): JWTPayload => {
    try {
        return jwt.verify(token, config.jwt.secret) as JWTPayload;
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

export const verifyRefreshToken = (token: string): JWTPayload => {
    try {
        return jwt.verify(token, config.jwt.refreshSecret) as JWTPayload;
    } catch (error) {
        throw new Error('Invalid or expired refresh token');
    }
};
