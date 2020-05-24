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
        websiteUrl: '',
        recentPosts: []
    };

    await db.doc(`users/${user.uid}`).set(newUser);
});

export const createPost = functions.firestore
    .document('posts/{postId}')
    .onCreate((snap, context) => {
        const post = snap.data();
        if (!post || !post.userId) throw new Error('Invalid Post');
        const increment = admin.firestore.FieldValue.increment(1);
        // get user doc
        // modify recent posts
        // update postCount & recentPosts
        return db.doc(`users/${post.userId}`).update({ postCount: increment });
    });

export const deletePost = functions.firestore
    .document('posts/{postId}')
    .onDelete((snap, context) => {
        const post = snap.data();
        if (!post || !post.userId) throw new Error('Invalid Post');

        // delete post images from storage

        const decrement = admin.firestore.FieldValue.increment(-1);
        return db.doc(`users/${post.userId}`).update({ postCount: decrement });
    });






// Coming up next...


// likePost
//   - increment post likes
//   - create favorites document

// unlikePost
//   - decrement post likes
//   - delete favorites document
