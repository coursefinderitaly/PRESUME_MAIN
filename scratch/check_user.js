const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://PresumeOfficialDatabase:Presume7780@presumeofficial.qipgizz.mongodb.net/presume?retryWrites=true&w=majority&appName=PresumeOfficial";

async function main() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('presume');
    const user = await db.collection('users').findOne({ email: "navneetnamdev100@gmail.com" });
    console.log(JSON.stringify(user, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}
main();
