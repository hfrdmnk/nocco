---
name: microblog-themes
description: Create and customize Micro.blog themes using Hugo templating. Use when building new Micro.blog themes, customizing existing themes, creating custom layouts for posts/photos/pages, working with Micro.blog-specific template variables (.Site.Params), implementing photo galleries, configuring taxonomies (categories/tags), or troubleshooting Hugo template issues in Micro.blog context.
---

# Micro.blog Theme Development

Micro.blog uses Hugo as its static site generator. Themes are Hugo themes with Micro.blog-specific conventions and variables.

## Quick Reference

**Official Docs:**

- Theme documentation: https://help.micro.blog/t/custom-themes/59
- Hugo integration: https://help.micro.blog/t/what-version-of-hugo-does-micro-blog-use/53
- Template variables: https://help.micro.blog/t/template-variables/2375
- Plugin development: https://help.micro.blog/t/developing-plug-ins/1036

**Hugo Version:** Micro.blog uses Hugo 0.91.2 (extended). Do not use features from newer Hugo versions.

## Theme Structure

```
theme-name/
├── layouts/
│   ├── _default/
│   │   ├── baseof.html      # Base template (optional)
│   │   ├── single.html      # Individual posts
│   │   └── list.html        # List pages (home, archives)
│   ├── partials/
│   │   ├── head.html        # <head> content
│   │   ├── header.html      # Site header
│   │   └── footer.html      # Site footer
│   ├── photos/
│   │   └── single.html      # Photo post layout (if different from posts)
│   ├── index.html           # Homepage (overrides list.html for home)
│   └── 404.html             # Not found page
├── static/
│   ├── css/
│   └── js/
└── theme.toml               # Theme metadata (optional for custom themes)
```

## Core Principles

1. **Mobile-first**: Micro.blog is heavily used on mobile devices
2. **Performance**: Keep assets minimal; avoid heavy JavaScript frameworks
3. **IndieWeb compatible**: Support microformats (h-entry, h-card) for webmentions
4. **Graceful degradation**: Work without JavaScript enabled

## Essential Template Variables

### Site-Level (`.Site.Params`)

```go
{{ .Site.Params.author_name }}     // Blog author name
{{ .Site.Params.author_avatar }}   // Avatar URL
{{ .Site.Params.author_username }} // Micro.blog username
{{ .Site.Params.site_id }}         // Unique site identifier
{{ .Site.Params.include_podcast }} // Bool: has podcast
{{ .Site.Params.include_search }}  // Bool: search enabled
{{ .Site.Params.twitter_username }}
{{ .Site.Params.github_username }}
{{ .Site.Params.instagram_username }}
{{ .Site.Params.mastodon_username }}
{{ .Site.Params.linkedin_url }}
```

### Page-Level

```go
{{ .Title }}                // Post title (may be empty for microblog posts)
{{ .Content }}              // Rendered HTML content
{{ .Summary }}              // Auto-generated summary
{{ .Date }}                 // Publish date
{{ .Permalink }}            // Full URL
{{ .RelPermalink }}         // Relative URL
{{ .Params.photos }}        // Array of photo URLs (for photo posts)
{{ .Section }}              // Content section (posts, photos, etc.)
{{ .Type }}                 // Content type
```

### Checking Post Types

```go
{{ if .Params.photos }}
    {{/* Photo post */}}
{{ else if .Title }}
    {{/* Long-form post with title */}}
{{ else }}
    {{/* Microblog post (no title) */}}
{{ end }}
```

## Common Patterns

### Basic Post Loop (list.html)

```go
{{ define "main" }}
<div class="posts h-feed">
    {{ range .Paginator.Pages }}
    <article class="post h-entry">
        {{ if .Title }}
            <h2 class="p-name"><a href="{{ .Permalink }}">{{ .Title }}</a></h2>
        {{ end }}
        <div class="e-content">{{ .Content }}</div>
        <time class="dt-published" datetime="{{ .Date.Format "2006-01-02T15:04:05Z07:00" }}">
            <a href="{{ .Permalink }}" class="u-url">
                {{ .Date.Format "Jan 2, 2006" }}
            </a>
        </time>
    </article>
    {{ end }}
</div>
{{ partial "pagination.html" . }}
{{ end }}
```

### Photo Gallery Grid

```go
{{ if .Params.photos }}
<div class="photo-grid">
    {{ range .Params.photos }}
    <img src="{{ . }}" loading="lazy" alt="">
    {{ end }}
</div>
{{ end }}
```

### Pagination

```go
{{ if gt .Paginator.TotalPages 1 }}
<nav class="pagination">
    {{ if .Paginator.HasPrev }}
        <a href="{{ .Paginator.Prev.URL }}">← Newer</a>
    {{ end }}
    {{ if .Paginator.HasNext }}
        <a href="{{ .Paginator.Next.URL }}">Older →</a>
    {{ end }}
</nav>
{{ end }}
```

### Microformats (h-card) for Author

```go
<div class="h-card p-author">
    {{ with .Site.Params.author_avatar }}
        <img class="u-photo" src="{{ . }}" alt="">
    {{ end }}
    <a class="p-name u-url" href="{{ .Site.BaseURL }}">
        {{ .Site.Params.author_name }}
    </a>
</div>
```

## Content Sections

Micro.blog supports multiple content types via sections:

| Section    | URL Pattern       | Use Case             |
| ---------- | ----------------- | -------------------- |
| posts      | /YYYY/MM/DD/slug/ | Standard blog posts  |
| photos     | /photos/YYYY/...  | Photo-specific posts |
| pages      | /page-name/       | Static pages         |
| categories | /categories/name/ | Category archives    |

### Section-Specific Layouts

Create `layouts/photos/single.html` for photo-specific templates:

```go
{{ define "main" }}
<article class="photo-post h-entry">
    {{ if .Params.photos }}
    <div class="photo-gallery">
        {{ range .Params.photos }}
        <figure>
            <img src="{{ . }}" alt="" class="u-photo">
        </figure>
        {{ end }}
    </div>
    {{ end }}
    <div class="e-content">{{ .Content }}</div>
</article>
{{ end }}
```

## Reference Files

For detailed information, consult:

- **Hugo templating fundamentals**: See [references/hugo-basics.md](references/hugo-basics.md)
- **Micro.blog-specific features**: See [references/microblog-specifics.md](references/microblog-specifics.md)
- **Common patterns and examples**: See [references/common-patterns.md](references/common-patterns.md)

## Development Workflow

1. **Local testing not available** - Micro.blog themes must be tested on the platform
2. **Use Design → Edit Custom Themes** in Micro.blog dashboard
3. **Clone existing theme** as starting point for major customizations
4. **Test on mobile** - Use browser dev tools responsive mode

## Troubleshooting

| Issue                  | Solution                                                 |
| ---------------------- | -------------------------------------------------------- |
| Template not rendering | Check Hugo 0.91 compatibility; avoid newer syntax        |
| Photos not showing     | Ensure `.Params.photos` (lowercase) not `.Params.Photos` |
| Pagination broken      | Use `.Paginator.Pages` not `.Pages` in list templates    |
| CSS not loading        | Check path starts with `/` for absolute URLs             |
| Blank pages            | Look for unclosed template tags `{{ end }}`              |
