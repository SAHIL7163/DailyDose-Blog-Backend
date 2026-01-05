// buildImagePrompt.js

function buildImagePrompt(
  imageUrl,
  categories = [
    "Travel",
    "Tech",
    "Finance",
    "Fashion",
    "Food",
    "PersonalBlog",
    "Sports",
  ]
) {
  const categoriesList = categories.map((c, i) => `${i}: ${c}`).join(", ");

  return `You are an expert blog content writer. Your task is to create engaging, high-quality blog content inspired by a single image.

Image URL: ${imageUrl}

Available categories (index: name): ${categoriesList}

Generate ONLY a valid JSON object with exactly these four fields (no extra text, no markdown, no explanations):

{
  "title": "A catchy, SEO-friendly blog post title (one line only)",
  "body": "A complete blog post body between 200–350 words inspired by the image. RETURN THE BODY AS HTML using ONLY these tags: <p>, <strong>, <em>, <u>, <a>, <br>, <h2>, <h3>, <blockquote>, <ul>, <li>, <ol>, <span>. Do NOT include images, CSS, style tags, or scripts. HTML must be clean and well-formed.",
  "category": "Choose exactly one category from the available categories above",
  "category_id": 0
}

HTML BODY RULES:
- Structure must be created with <p> tags for paragraphs.
- You may use allowed inline tags: <strong>, <em>, <u>, <a>, <span>.
- You may optionally use <br>, <h2>, <h3>, <blockquote>, <ul>, <ol>, <li>.
- No external links unless simple <a href="#"> placeholders.
- No markdown. No images. No CSS. No classes or ids.
- Word count of visible text must be 200–350 words.

### Few-Shot Examples (STYLE ONLY — match format):

Example 1:
Image: A sunrise mountain trail.
Response:
{
  "title": "Why I Wake Up at 4 AM to Chase Sunrises on Mountain Trails",
  "body": "<p>There’s something magical about being the first person on a trail while the world still sleeps. The cold air greets you with a clarity that feels almost sacred...</p><p>As the sun begins to stretch across the ridges, the entire trail transforms. <strong>The colors shift</strong>, shadows drift, and you suddenly become aware of how much beauty hides in silence. It’s a reminder that some of the best moments in life happen before the noise begins.</p>",
  "category": "Travel",
  "category_id": 0
}

Example 2:
Image: RGB keyboard on a desk.
Response:
{
  "title": "I Spent $300 on a Keyboard and It Changed How I Work Forever",
  "body": "<p>When I first told my friends I was spending hundreds on a mechanical keyboard, they laughed. But once it arrived, everything changed...</p><p>The <em>tactile feedback</em>, soft clicks, and responsive keys made me type smoother and faster. My workflow improved, and work felt less like a chore. Sometimes investing in the tools you use daily makes all the difference.</p>",
  "category": "Tech",
  "category_id": 1
}

Example 3:
Image: Ramen bowl with steam.
Response:
{
  "title": "The One Ramen Recipe That Finally Made Me Love Cooking",
  "body": "<p>For years, cooking felt intimidating. That changed when I tried making ramen at home. The experience felt less like cooking and more like building comfort in a bowl...</p><p>As the broth simmered and aromas filled the air, I realized how soothing the process was. This bowl taught me that cooking can be a form of therapy, not a task to avoid.</p>",
  "category": "Food",
  "category_id": 4
}

Now generate the JSON for the current image. Remember: valid JSON only, no explanations.`;
}

module.exports = { buildImagePrompt };
