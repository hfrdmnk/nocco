# Common Patterns and Examples

Practical examples and patterns for Micro.blog theme development.

## Table of Contents
1. [Complete Theme Scaffolds](#complete-theme-scaffolds)
2. [Layout Patterns](#layout-patterns)
3. [Navigation Patterns](#navigation-patterns)
4. [Content Display Patterns](#content-display-patterns)
5. [Microformats (IndieWeb)](#microformats-indieweb)
6. [Responsive Design](#responsive-design)
7. [Dark Mode](#dark-mode)
8. [Performance Patterns](#performance-patterns)

---

## Complete Theme Scaffolds

### Minimal baseof.html
```go
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ if .Title }}{{ .Title }} | {{ end }}{{ .Site.Title }}</title>
    <link rel="stylesheet" href="/css/style.css">
    {{ partial "head.html" . }}
</head>
<body>
    {{ partial "header.html" . }}
    <main>
        {{ block "main" . }}{{ end }}
    </main>
    {{ partial "footer.html" . }}
</body>
</html>
```

### Minimal header.html Partial
```go
<header class="site-header">
    <div class="header-inner">
        {{ with .Site.Params.author_avatar }}
            <a href="{{ $.Site.BaseURL }}" class="avatar-link">
                <img src="{{ . }}" alt="" class="avatar">
            </a>
        {{ end }}
        <div class="site-info">
            <a href="{{ .Site.BaseURL }}" class="site-title">{{ .Site.Title }}</a>
            {{ with .Site.Params.author_bio }}
                <p class="site-description">{{ . }}</p>
            {{ end }}
        </div>
    </div>
    {{ partial "navigation.html" . }}
</header>
```

### Minimal footer.html Partial
```go
<footer class="site-footer">
    <p>&copy; {{ now.Year }} {{ .Site.Params.author_name }}</p>
    {{ partial "social-links.html" . }}
    <p class="powered-by">
        Powered by <a href="https://micro.blog">Micro.blog</a>
    </p>
</footer>
```

---

## Layout Patterns

### Homepage with Pinned Post
```go
{{ define "main" }}
{{/* Pinned/featured content */}}
{{ with .Site.GetPage "/about" }}
<div class="featured-section">
    <h2>About</h2>
    {{ .Summary }}
    <a href="{{ .Permalink }}">Read more</a>
</div>
{{ end }}

{{/* Recent posts */}}
<section class="recent-posts">
    <h2>Recent Posts</h2>
    {{ range first 10 .Site.RegularPages }}
        {{ partial "post-summary.html" . }}
    {{ end }}
</section>
{{ end }}
```

### Archive by Year
```go
{{ define "main" }}
<div class="archive">
    {{ range .Pages.GroupByDate "2006" }}
    <section class="archive-year">
        <h2>{{ .Key }}</h2>
        <ul>
            {{ range .Pages }}
            <li>
                <time datetime="{{ .Date.Format "2006-01-02" }}">
                    {{ .Date.Format "Jan 2" }}
                </time>
                <a href="{{ .Permalink }}">
                    {{ if .Title }}{{ .Title }}{{ else }}{{ .Summary | truncate 50 }}{{ end }}
                </a>
            </li>
            {{ end }}
        </ul>
    </section>
    {{ end }}
</div>
{{ end }}
```

### Split Layout (Long-form vs Microblog)
```go
{{ define "main" }}
<div class="split-layout">
    <section class="articles">
        <h2>Articles</h2>
        {{ range where .Pages "Title" "!=" "" }}
            {{ partial "article-card.html" . }}
        {{ end }}
    </section>
    
    <section class="notes">
        <h2>Notes</h2>
        {{ range where .Pages "Title" "" }}
            {{ partial "note.html" . }}
        {{ end }}
    </section>
</div>
{{ end }}
```

---

## Navigation Patterns

### Simple Navigation
```go
<nav class="main-nav">
    <ul>
        <li><a href="{{ .Site.BaseURL }}" {{ if .IsHome }}aria-current="page"{{ end }}>Home</a></li>
        <li><a href="{{ .Site.BaseURL }}archive/" {{ if eq .RelPermalink "/archive/" }}aria-current="page"{{ end }}>Archive</a></li>
        <li><a href="{{ .Site.BaseURL }}about/" {{ if eq .RelPermalink "/about/" }}aria-current="page"{{ end }}>About</a></li>
        {{ if .Site.Params.include_photos_page }}
        <li><a href="{{ .Site.BaseURL }}photos/">Photos</a></li>
        {{ end }}
    </ul>
</nav>
```

### Category Navigation
```go
<nav class="category-nav">
    <ul>
        {{ range .Site.Taxonomies.categories }}
        <li>
            <a href="{{ .Page.Permalink }}">
                {{ .Page.Title }} ({{ .Count }})
            </a>
        </li>
        {{ end }}
    </ul>
</nav>
```

### Breadcrumbs
```go
<nav aria-label="Breadcrumb" class="breadcrumbs">
    <ol>
        <li><a href="{{ .Site.BaseURL }}">Home</a></li>
        {{ if .Section }}
        <li><a href="{{ .Site.BaseURL }}{{ .Section }}/">{{ .Section | title }}</a></li>
        {{ end }}
        {{ if .Title }}
        <li aria-current="page">{{ .Title }}</li>
        {{ end }}
    </ol>
</nav>
```

---

## Content Display Patterns

### Smart Post Card (handles all types)
```go
{{/* partial: post-card.html */}}
<article class="post-card h-entry {{ if .Params.photos }}has-photos{{ end }}">
    {{/* Photos first if present */}}
    {{ with .Params.photos }}
    <div class="post-photos {{ if eq (len .) 1 }}single{{ else }}grid{{ end }}">
        {{ range first 4 . }}
            <img src="{{ . }}" alt="" loading="lazy" class="u-photo">
        {{ end }}
        {{ if gt (len .) 4 }}
            <span class="more-photos">+{{ sub (len .) 4 }} more</span>
        {{ end }}
    </div>
    {{ end }}
    
    {{/* Title if present */}}
    {{ with .Title }}
        <h2 class="post-title p-name">
            <a href="{{ $.Permalink }}" class="u-url">{{ . }}</a>
        </h2>
    {{ end }}
    
    {{/* Content */}}
    <div class="post-content e-content">
        {{ if .Title }}
            {{ .Summary }}
        {{ else }}
            {{ .Content }}
        {{ end }}
    </div>
    
    {{/* Meta */}}
    <footer class="post-meta">
        <time class="dt-published" datetime="{{ .Date.Format "2006-01-02T15:04:05Z07:00" }}">
            <a href="{{ .Permalink }}" class="u-url">
                {{ .Date.Format "Jan 2, 2006" }}
            </a>
        </time>
    </footer>
</article>
```

### Excerpt with "Continue Reading"
```go
<div class="post-excerpt">
    {{ .Summary }}
    {{ if .Truncated }}
        <a href="{{ .Permalink }}" class="read-more">Continue reading →</a>
    {{ end }}
</div>
```

### Related Posts (by Category)
```go
{{ $related := slice }}
{{ with .Params.categories }}
    {{ $currentPage := $ }}
    {{ range . }}
        {{ $posts := where $.Site.RegularPages "Params.categories" "intersect" (slice .) }}
        {{ $related = $related | append $posts }}
    {{ end }}
{{ end }}

{{ $related = $related | uniq | first 5 }}
{{ if $related }}
<aside class="related-posts">
    <h3>Related Posts</h3>
    <ul>
        {{ range $related }}
            {{ if ne .Permalink $.Permalink }}
            <li><a href="{{ .Permalink }}">{{ .Title }}</a></li>
            {{ end }}
        {{ end }}
    </ul>
</aside>
{{ end }}
```

---

## Microformats (IndieWeb)

### h-entry for Posts
```go
<article class="h-entry">
    {{ with .Title }}
        <h1 class="p-name">{{ . }}</h1>
    {{ end }}
    
    <div class="e-content">
        {{ .Content }}
    </div>
    
    {{/* Author h-card */}}
    <a class="p-author h-card" href="{{ .Site.BaseURL }}">
        {{ with .Site.Params.author_avatar }}
            <img class="u-photo" src="{{ . }}" alt="">
        {{ end }}
        <span class="p-name">{{ .Site.Params.author_name }}</span>
    </a>
    
    <time class="dt-published" datetime="{{ .Date.Format "2006-01-02T15:04:05Z07:00" }}">
        {{ .Date.Format "January 2, 2006" }}
    </time>
    
    <a class="u-url" href="{{ .Permalink }}">Permalink</a>
    
    {{/* Categories */}}
    {{ range .Params.categories }}
        <a class="p-category" href="{{ $.Site.BaseURL }}categories/{{ . | urlize }}/">{{ . }}</a>
    {{ end }}
</article>
```

### h-card for Author (About Page)
```go
<div class="h-card">
    {{ with .Site.Params.author_avatar }}
        <img class="u-photo" src="{{ . }}" alt="">
    {{ end }}
    <h1 class="p-name">{{ .Site.Params.author_name }}</h1>
    {{ with .Site.Params.author_bio }}
        <p class="p-note">{{ . }}</p>
    {{ end }}
    <a class="u-url u-uid" href="{{ .Site.BaseURL }}">{{ .Site.BaseURL }}</a>
    
    {{/* Social links with rel="me" */}}
    {{ with .Site.Params.twitter_username }}
        <a class="u-url" rel="me" href="https://twitter.com/{{ . }}">Twitter</a>
    {{ end }}
    {{ with .Site.Params.github_username }}
        <a class="u-url" rel="me" href="https://github.com/{{ . }}">GitHub</a>
    {{ end }}
</div>
```

### h-feed for Homepage
```go
<div class="h-feed">
    <h1 class="p-name">{{ .Site.Title }}</h1>
    {{ range .Paginator.Pages }}
        {{/* Each item is h-entry */}}
        {{ partial "post-card.html" . }}
    {{ end }}
</div>
```

---

## Responsive Design

### CSS Grid Photo Gallery
```css
.photo-grid {
    display: grid;
    gap: 0.5rem;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}

.photo-grid.grid-2 {
    grid-template-columns: repeat(2, 1fr);
}

.photo-grid.grid-3 {
    grid-template-columns: repeat(3, 1fr);
}

@media (max-width: 600px) {
    .photo-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}
```

### Responsive Typography
```css
:root {
    --font-size-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
    --font-size-h1: clamp(1.75rem, 1.5rem + 1vw, 2.5rem);
    --font-size-h2: clamp(1.5rem, 1.25rem + 0.75vw, 2rem);
}

body {
    font-size: var(--font-size-base);
    line-height: 1.6;
}

h1 { font-size: var(--font-size-h1); }
h2 { font-size: var(--font-size-h2); }
```

### Mobile Navigation
```css
.main-nav ul {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    list-style: none;
    padding: 0;
}

@media (max-width: 480px) {
    .main-nav ul {
        flex-direction: column;
        gap: 0.5rem;
    }
}
```

---

## Dark Mode

### CSS Custom Properties Approach
```css
:root {
    --color-bg: #ffffff;
    --color-text: #222222;
    --color-text-muted: #666666;
    --color-link: #0066cc;
    --color-border: #e0e0e0;
}

@media (prefers-color-scheme: dark) {
    :root {
        --color-bg: #1a1a1a;
        --color-text: #e0e0e0;
        --color-text-muted: #999999;
        --color-link: #6db3f2;
        --color-border: #333333;
    }
}

body {
    background: var(--color-bg);
    color: var(--color-text);
}

a { color: var(--color-link); }
```

### Dark Mode Toggle (JavaScript)
```html
<button id="theme-toggle" aria-label="Toggle dark mode">🌓</button>

<script>
const toggle = document.getElementById('theme-toggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

function setTheme(dark) {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
}

toggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    setTheme(!isDark);
});

// Initialize based on system preference
setTheme(prefersDark.matches);
</script>
```

---

## Performance Patterns

### Lazy Loading Images
```go
{{ range .Params.photos }}
    <img src="{{ . }}" 
         alt="" 
         loading="lazy"
         decoding="async">
{{ end }}
```

### Critical CSS Inline
```go
{{/* In head.html */}}
<style>
/* Critical above-the-fold CSS */
body { margin: 0; font-family: system-ui, sans-serif; }
.site-header { /* ... */ }
</style>
<link rel="stylesheet" href="/css/style.css" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="/css/style.css"></noscript>
```

### Preload Key Assets
```go
<link rel="preload" href="/css/style.css" as="style">
{{ with .Site.Params.author_avatar }}
    <link rel="preload" href="{{ . }}" as="image">
{{ end }}
```

### Minimal JavaScript Pattern
```html
<!-- Only load JS when needed -->
{{ if .Params.photos }}
    {{ if gt (len .Params.photos) 1 }}
        <script src="/js/lightbox.js" defer></script>
    {{ end }}
{{ end }}
```

### Font Loading Strategy
```css
/* System font stack - no loading delay */
body {
    font-family: 
        -apple-system, 
        BlinkMacSystemFont, 
        "Segoe UI", 
        Roboto, 
        Oxygen-Sans, 
        Ubuntu, 
        Cantarell, 
        "Helvetica Neue", 
        sans-serif;
}

/* If using web fonts, use font-display: swap */
@font-face {
    font-family: 'CustomFont';
    src: url('/fonts/custom.woff2') format('woff2');
    font-display: swap;
}
```
