import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);

const updateItemCount = async (event) => {
  const item = event.data.data();

  const allItems = await admin.firestore().collection('items')
    .where('collectionFBID', '==', item.collectionFBID)
    .get();


  const collectionDoc = admin.firestore().collection('collections').doc(item.collectionFBID);

  return collectionDoc.update({
    itemCount: allItems.size
  });
};

export const updateItemCountOnAdd = functions.firestore
  .document('items/{itemId}')
  .onCreate(updateItemCount);

export const updateItemCountOnRemove = functions.firestore
  .document('items/{itemId}')
  .onDelete(updateItemCount);
