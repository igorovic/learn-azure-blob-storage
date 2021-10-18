const { BlobServiceClient } = require("@azure/storage-blob");
const { DefaultAzureCredential } = require("@azure/identity");

// Load the .env file if it exists
require("dotenv").config();

async function main() {
  // Enter your storage account name
  const account = process.env.ACCOUNT_NAME || "";

  // Azure AD Credential information is required to run this sample:
  if (
    !process.env.AZURE_TENANT_ID ||
    !process.env.AZURE_CLIENT_ID ||
    !process.env.AZURE_CLIENT_SECRET
  ) {
    console.warn(
      "Azure AD authentication information not provided, but it is required to run this sample. Exiting."
    );
    return;
  }

  // ONLY AVAILABLE IN NODE.JS RUNTIME
  // If you are using the browser, you can use the InteractiveBrowserCredential provided via @azure/identity or any other feasible implementation of TokenCredential.
  // DefaultAzureCredential will first look for Azure Active Directory (AAD)
  // client secret credentials in the following environment variables:
  //
  // - AZURE_TENANT_ID: The ID of your AAD tenant
  // - AZURE_CLIENT_ID: The ID of your AAD app registration (client)
  // - AZURE_CLIENT_SECRET: The client secret for your AAD app registration
  //
  // If those environment variables aren't found and your application is deployed
  // to an Azure VM or App Service instance, the managed service identity endpoint
  // will be used as a fallback authentication source.
  const defaultAzureCredential = new DefaultAzureCredential();

  const blobServiceClient = new BlobServiceClient(
    `https://${account}.blob.core.windows.net`,
    defaultAzureCredential
  );

  // Create a container
  const containerName = `upload`;
  const containerClient = await blobServiceClient.getContainerClient(
    containerName
  );

  let i = 1;
  let iter = containerClient.listBlobsFlat();
  let blobItem = await iter.next();
  while (!blobItem.done) {
    console.log(`Blob ${i++}: ${blobItem.value.name}`);
    blobItem = await iter.next();
  }
}

main().catch((err) => {
  console.error("Error running sample:", err.message);
});
