// Diagnostic script using global fetch (requires Node 18+)

const urls = [
  'https://pscmockbackend.vercel.app/health',
  'https://pscmockbackend.vercel.app/user/questions',
  'https://pscmockbackend.vercel.app/questions',
  'https://pscmockbackend.vercel.app/api/questions'
];

async function testFetch() {
  console.log("🔍 Starting API diagnostic test...\n");

  for (const url of urls) {
    try {
      console.log(`📡 Fetching: ${url}`);
      const response = await fetch(url);
      console.log(`📊 Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const text = await response.text();
        console.log(`✅ Success! Data length: ${text.length} chars`);
      } else {
        console.log(`❌ Failed with status ${response.status}`);
      }
    } catch (error) {
      console.log(`💥 Network Error: ${error.message}`);
    }
    console.log("-----------------------------------\n");
  }
}

testFetch();
