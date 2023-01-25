import fs from "fs/promises";
import path from "path";

async function main() {
  await fs.cp(
    path.join(__dirname, "../assets/header.png"),
    path.join(__dirname, "../docs/assets/header.png")
  );
}

if (require.main === module) {
  main();
}
