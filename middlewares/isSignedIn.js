import jwt from "jsonwebtoken"
const isSignedIn = async (req, res, next) => {
    try {
        const headers = req.headers;
        const authHeader = headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: 'Authorization header missing', success: false });
        }
        const token = authHeader
        if (!token) {
            return res.status(401).json({ error: 'Token missing', success: false });
        }

        const decoded = jwt.verify(token, process.env.SECRET);

        if (!decoded) {
            return res.status(401).json({ error: 'Invalid token', success: false });
        }

        req.user = decoded; // Attach decoded user info to the request object for use in other middleware/routes
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired', success: false });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token', success: false });
        } else {
            return res.status(500).json({ error: 'Internal server error', success: false });
        }
    }
};

export default isSignedIn