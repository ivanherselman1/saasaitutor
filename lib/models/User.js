// lib/models/User.js

export const createUser = async (db, userData) => {
    const { name, email, image } = userData;
  
    const result = await db.collection("users").insertOne({
      name,
      email,
      image,
      createdAt: new Date(),
    });
  
    return result;
  };
  
  export const findUserByEmail = async (db, email) => {
    return await db.collection("users").findOne({ email });
  };
  