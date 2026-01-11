# Micro.blog-Specific Features

This reference covers Micro.blog platform-specific variables, features, and conventions.

## Table of Contents
1. [Site Parameters](#site-parameters)
2. [Page Parameters](#page-parameters)
3. [Photo Posts](#photo-posts)
4. [Podcasting](#podcasting)
5. [Conversations & Replies](#conversations--replies)
6. [Search](#search)
7. [Plugins](#plugins)
8. [Feeds](#feeds)
9. [Custom CSS](#custom-css)
10. [Platform Constraints](#platform-constraints)

---

## Site Parameters

All site-level configuration is accessed via `.Site.Params`:

### Author Information
```go
{{ .Site.Params.author_name }}       // Display name
{{ .Site.Params.author_avatar }}     // Avatar image URL
{{ .Site.Params.author_username }}   // @username on Micro.blog
{{ .Site.Params.author_bio }}        // Bio text
```

### Site Identity
```go
{{ .Site.Params.site_id }}           // Unique site identifier
{{ .Site.BaseURL }}                   // Site URL (standard Hugo)
{{ .Site.Title }}                     // Site title (standard Hugo)
```

### Social Links
```go
{{ .Site.Params.twitter_username }}
{{ .Site.Params.github_username }}
{{ .Site.Params.instagram_username }}
{{ .Site.Params.mastodon_username }}
{{ .Site.Params.linkedin_url }}
{{ .Site.Params.facebook_username }}
{{ .Site.Params.tumblr_username }}
{{ .Site.Params.flickr_username }}
{{ .Site.Params.medium_username }}
{{ .Site.Params.youtube_username }}
{{ .Site.Params.threads_username }}
{{ .Site.Params.bluesky_username }}
```

### Feature Flags
```go
{{ .Site.Params.include_search }}     // Search enabled
{{ .Site.Params.include_podcast }}    // Has podcast feed
{{ .Site.Params.include_conversation }} // Show replies/conversation
{{ .Site.Params.include_photos_page }} // Dedicated photos page
{{ .Site.Params.include_replies }}    // Show @-replies
```

### Building Social Links Partial
```go
<nav class="social-links">
    {{ with .Site.Params.twitter_username }}
        <a href="https://twitter.com/{{ . }}" rel="me">Twitter</a>
    {{ end }}
    {{ with .Site.Params.github_username }}
        <a href="https://github.com/{{ . }}" rel="me">GitHub</a>
    {{ end }}
    {{ with .Site.Params.mastodon_username }}
        {{/* Mastodon URLs vary by instance - may need full URL */}}
        <a href="{{ . }}" rel="me">Mastodon</a>
    {{ end }}
</nav>
```

---

## Page Parameters

### Standard Page Variables
```go
{{ .Title }}           // Post title (empty for microblog posts)
{{ .Content }}         // Rendered content
{{ .Summary }}         // Auto-generated excerpt
{{ .Date }}            // Publish date
{{ .Lastmod }}         // Last modified date
{{ .Permalink }}       // Full URL
{{ .RelPermalink }}    // Relative URL
{{ .WordCount }}       // Word count
{{ .ReadingTime }}     // Estimated reading time (minutes)
{{ .Draft }}           // Is draft (bool)
```

### Micro.blog-Specific Page Params
```go
{{ .Params.photos }}           // Array of photo URLs
{{ .Params.categories }}       // Categories (array)
{{ .Params.tags }}             // Tags (array)
{{ .Params.audio }}            // Podcast audio URL
{{ .Params.audio_duration }}   // Duration in seconds
{{ .Params.audio_length }}     // File size in bytes
```

### Detecting Post Types
```go
{{/* Microblog post (no title) */}}
{{ if not .Title }}
    <article class="microblog">

{{/* Long-form post (has title) */}}
{{ else }}
    <article class="post">
{{ end }}

{{/* Photo post */}}
{{ if .Params.photos }}
    <article class="photo-post">

{{/* Podcast episode */}}
{{ if .Params.audio }}
    <article class="podcast-episode">
{{ end }}
```

---

## Photo Posts

### Structure
Photo posts have the `.Params.photos` array containing image URLs.

```go
{{ with .Params.photos }}
    {{ range . }}
        <img src="{{ . }}" alt="" loading="lazy">
    {{ end }}
{{ end }}
```

### Photo Count Logic
```go
{{ $photoCount := 0 }}
{{ with .Params.photos }}
    {{ $photoCount = len . }}
{{ end }}

{{ if eq $photoCount 1 }}
    <div class="single-photo">
{{ else if le $photoCount 4 }}
    <div class="photo-grid grid-{{ $photoCount }}">
{{ else }}
    <div class="photo-grid grid-many">
{{ end }}
```

### Lightbox Integration
```go
{{ range $index, $photo := .Params.photos }}
    <a href="{{ $photo }}" 
       class="lightbox" 
       data-gallery="{{ $.Permalink }}">
        <img src="{{ $photo }}" 
             alt="Photo {{ add $index 1 }}"
             loading="lazy">
    </a>
{{ end }}
```

### Photo Page Archive
For `/photos/` listing page (`layouts/photos/list.html`):

```go
{{ define "main" }}
<div class="photo-archive">
    {{ range .Paginator.Pages }}
        {{ with .Params.photos }}
            {{ range . }}
                <a href="{{ $.Permalink }}">
                    <img src="{{ . }}" loading="lazy" alt="">
                </a>
            {{ end }}
        {{ end }}
    {{ end }}
</div>
{{ partial "pagination.html" . }}
{{ end }}
```

---

## Podcasting

### Checking for Podcast
```go
{{ if .Site.Params.include_podcast }}
    <a href="{{ .Site.BaseURL }}feed.xml">Subscribe to Podcast</a>
{{ end }}
```

### Episode Template
```go
{{ if .Params.audio }}
<div class="podcast-player">
    <audio controls preload="metadata">
        <source src="{{ .Params.audio }}" type="audio/mpeg">
    </audio>
    {{ with .Params.audio_duration }}
        <span class="duration">{{ . | div 60 }}:{{ mod . 60 | printf "%02d" }}</span>
    {{ end }}
</div>
{{ end }}
```

### Podcast Feed Link
The podcast feed is available at `/feed.xml` (RSS) or `/feed.json` (JSON Feed).

---

## Conversations & Replies

### Webmention Display
Micro.blog handles webmentions. The conversation partial shows replies:

```go
{{ if .Site.Params.include_conversation }}
    {{ partial "conversation.html" . }}
{{ end }}
```

### Reply Links
```go
<a href="https://micro.blog/{{ .Site.Params.author_username }}/{{ .Date.Format "2006/01/02" }}/{{ path.Base .RelPermalink }}">
    Reply on Micro.blog
</a>
```

### Hiding @-Replies
Some themes filter out @-replies from main feed:
```go
{{ range where .Paginator.Pages "Params.is_reply" "!=" true }}
    {{/* Post content */}}
{{ end }}
```

---

## Search

### Checking if Enabled
```go
{{ if .Site.Params.include_search }}
    <form action="/search/" method="get">
        <input type="search" name="q" placeholder="Search...">
        <button type="submit">Search</button>
    </form>
{{ end }}
```

### Search Results Page
Micro.blog provides built-in search. The `/search/` page is handled by the platform.

---

## Plugins

Plugins are mini-themes that add functionality. They use the same Hugo structure.

### Plugin Structure
```
plugin-name/
├── layouts/
│   └── partials/
│       └── plugin-name/
│           └── head.html    // Injected into <head>
└── static/
    └── plugin-name/
        └── style.css
```

### Plugin Hooks
Themes should include plugin hooks:

```go
{{/* In head partial */}}
{{ range .Site.Data.plugin_css }}
    <link rel="stylesheet" href="{{ . }}">
{{ end }}
{{ range .Site.Data.plugin_html }}
    {{ . | safeHTML }}
{{ end }}
```

---

## Feeds

### Available Feeds
- `/feed.xml` - Main RSS feed
- `/feed.json` - JSON Feed
- `/categories/[name]/feed.xml` - Category feeds
- `/photos/feed.xml` - Photos feed (if enabled)

### Feed Discovery Links
```go
<link rel="alternate" type="application/rss+xml" 
      title="{{ .Site.Title }}" 
      href="{{ .Site.BaseURL }}feed.xml">
<link rel="alternate" type="application/json" 
      title="{{ .Site.Title }}" 
      href="{{ .Site.BaseURL }}feed.json">
```

---

## Custom CSS

### User Custom CSS Location
Users can add custom CSS via Micro.blog dashboard. It's injected after theme CSS.

### CSS Best Practices for Themes
```css
/* Use specific selectors to allow overrides */
.post-content p { ... }

/* Avoid !important - breaks user customization */

/* Provide CSS custom properties for easy theming */
:root {
    --text-color: #333;
    --bg-color: #fff;
    --accent-color: #0066cc;
    --font-family: system-ui, sans-serif;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
    :root {
        --text-color: #eee;
        --bg-color: #1a1a1a;
    }
}
```

---

## Platform Constraints

### Hugo Version Compatibility
Micro.blog uses **Hugo 0.91.2 extended**. Avoid:
- `.GetPage` with path syntax (use older syntax)
- `resources.GetRemote` (added in 0.91+, may be unstable)
- `transform.Unmarshal` for remote data
- Newer `where` clause syntax changes

### File Locations
- No access to `content/` directory structure
- Static files served from `/static/` directory
- Partials must be in `layouts/partials/`

### No Build Tools
- Cannot run npm/webpack/sass during build
- Pre-compile CSS/JS if using preprocessors
- Keep assets in `static/` directory

### JavaScript Considerations
- No server-side JavaScript
- Client-side JS must be static
- Consider no-JS fallbacks (many users block scripts)

### Image Handling
- Images uploaded to Micro.blog CDN
- Cannot process images at build time
- Use `loading="lazy"` for performance
- Micro.blog handles responsive images in editor

### Testing Limitations
- No local Hugo server for Micro.blog sites
- Must test in Micro.blog dashboard
- Use browser dev tools for debugging
- Clone theme before major changes
