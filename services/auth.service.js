import User from '../models/user.model.js';

export async function isAuthenticated(req, res, next) {
    const user = await User.find(req.headers['x-user-id']);

    if(user) {
        req.locals.user = user;
        next();
    } else {
        res.status(401).json({ error: 'unauthorized' });
    }
}
