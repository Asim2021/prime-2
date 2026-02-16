import db from '../src/models/index.js';

async function updateSchema() {
  try {
    console.log("Updating Leave Request Schema...");
    await db.leave_requests.sync({ alter: true });
    await db.attendances.sync({ alter: true });
    console.log("Schema Updated Successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Schema Update Failed:", error);
    process.exit(1);
  }
}

updateSchema();
