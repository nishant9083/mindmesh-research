const Parser = require('rss-parser');
const fs = require('fs');
const path = require('path');

const parser = new Parser();

const DATA_FILE = path.join(__dirname, 'blogs.json');

// Load existing blogs from file
function loadBlogs() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading blogs:', error.message);
  }
  return [];
}

// Save blogs to file
function saveBlogs(blogs) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(blogs, null, 2), 'utf-8');
}

async function fetchBlogs() {
  const existingBlogs = loadBlogs();
  const existingLinks = new Set(existingBlogs.map(b => b.link));

  const feed = await parser.parseURL(
    'https://medium.com/feed/tag/cryptocurrency'
  );

  let newCount = 0;

  for (const item of feed.items) {
    // Avoid duplicates
    if (!existingLinks.has(item.link)) {
      existingBlogs.push({
        title: item.title,
        link: item.link,
        content: item.contentSnippet || '',
        publishedAt: item.pubDate,
        source: feed.title,
        author: item.creator || 'Unknown',
        fetchedAt: new Date().toISOString()
      });
      newCount++;
    }
  }

  saveBlogs(existingBlogs);
  console.log(`Blogs updated. Added ${newCount} new articles. Total: ${existingBlogs.length}`);
  
  return existingBlogs;
}

// Run immediately
fetchBlogs().catch(console.error);