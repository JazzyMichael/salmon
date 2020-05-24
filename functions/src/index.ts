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
        recentPosts: [],
        favorites: []
    };

    await db.doc(`users/${user.uid}`).set(newUser);
});

export const createPost = functions.firestore
    .document('posts/{postId}')
    .onCreate(async (snap, context) => {
        const post = snap.data();
        const postId = context.params.postId;
        if (!post || !postId || !post.userId) throw new Error('Invalid Post');
        const postCount = admin.firestore.FieldValue.increment(1);

        const doc = await db.doc(`users/${post.userId}`).get();
        const user = doc.data() || {};
        let recentPosts = user.recentPosts || [];
        const length = recentPosts.unshift({ ...post, id: postId });
        if (length > 5) {
            recentPosts = recentPosts.slice(0, 5);
        }

        return db.doc(`users/${post.userId}`).update({ postCount, recentPosts });
    });

export const deletePost = functions.firestore
    .document('posts/{postId}')
    .onDelete(async (snap, context) => {
        const post = snap.data();
        const postId = context.params.postId;

        if (!post || !postId || !post.userId) throw new Error('Invalid Post');

        const paths = post.images.map((img: any) => img.path);

        const promises = paths.map((path: string) => {
            return admin.storage().bucket('theartofcookingsalmon.appspot.com').file(path).delete();
        });

        const postCount = admin.firestore.FieldValue.increment(-1);

        const doc = await db.doc(`users/${post.userId}`).get();
        const user = doc.data() || {};
        const recentPosts = user.recentPosts || [];
        const postIndex = recentPosts.findIndex((p: any) => p.id === postId);

        if (postIndex > -1) {
            recentPosts.splice(postIndex, 1);
        }

        const updateUser = db.doc(`users/${post.userId}`).update({ postCount, recentPosts });

        promises.push(updateUser);

        return Promise.all(promises);
    });

export const favoriteToggle = functions.https.onCall((data: any = {}, context) => {
    const { user, post, favorite } = data;

    if (!user || !post || !favorite) {
        console.log('invalid', { user, post, favorite });
        throw new Error('Invalid Favorite');
    }

    const batch = db.batch();

    const postRef = db.doc(`posts/${post.id}`);
    const increment = favorite ? 1 : -1;
    const likes = admin.firestore.FieldValue.increment(increment);
    batch.update(postRef, { likes });

    const userRef = db.doc(`users/${user.uid}`);
    const favorites = favorite
    ? [ post, ...user.favorites ].slice(0, 99)
    : user.favorites.filter(({ id }: any) => id !== post.id);
    batch.update(userRef, { favorites });

    return batch.commit();
});
