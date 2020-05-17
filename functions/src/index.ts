import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

export const createUser = functions.auth.user().onCreate(async (user: admin.auth.UserRecord) => {
    if (!user) {
        throw new Error('Invalid User Signup');
    }

    const username = user.displayName
        ? 'Salmon' + user.displayName.split(' ')[0] + Math.random().toString().slice(2, 7)
        : 'Salmon' + Math.random().toString().slice(2, 12);

    const createdAt = admin.firestore.FieldValue.serverTimestamp();

    const newUser = {
        username,
        createdAt,
        uid: user.uid,
        email: user.email,
        authProvider: user.providerData && user.providerData[0] && user.providerData[0].providerId || '',
        displayName: user.displayName,
        avatar: user.photoURL,
        postCount: 0,
        location: '',
        bio: '',
        facebookUrl: '',
        instagramUrl: '',
        twitterUrl: '',
        websiteUrl: ''
    };

    await db.doc(`users/${user.uid}`).set(newUser);
});

// Coming up next...

// createPost
//   - increment user postCount

// deletePost
//   - decrement user postCount

// likePost
//   - increment post likes
//   - create favorites document

// unlikePost
//   - decrement post likes
//   - delete favorites document
