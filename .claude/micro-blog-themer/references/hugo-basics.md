# Hugo Templating Basics for Micro.blog

This reference covers Hugo templating fundamentals relevant to Micro.blog theme development.

## Table of Contents
1. [Template Syntax](#template-syntax)
2. [Variables and Context](#variables-and-context)
3. [Control Structures](#control-structures)
4. [Functions](#functions)
5. [Partials](#partials)
6. [Template Lookup Order](#template-lookup-order)

---

## Template Syntax

### Basic Output
```go
{{ .Title }}              // Output variable
{{ .Title | upper }}      // Pipe to function
{{ "Hello" | printf "%s World" }}  // Printf formatting
```

### Comments
```go
{{/* This is a comment */}}
{{- /* Comment with whitespace trimming */ -}}
```

### Whitespace Control
```go
{{- .Title }}    // Trim whitespace before
{{ .Title -}}    // Trim whitespace after
{{- .Title -}}   // Trim both sides
```

---

## Variables and Context

### The Dot (.)
The dot represents the current context. It changes inside `range` and `with` blocks.

```go
{{ .Title }}           // Current page's title
{{ range .Pages }}
    {{ .Title }}       // Now refers to each page in range
{{ end }}
```

### Preserving Context with $
```go
{{ $siteTitle := .Site.Title }}
{{ range .Pages }}
    <h1>{{ $siteTitle }}</h1>  // Access outer context
    <h2>{{ .Title }}</h2>       // Current page in range
{{ end }}
```

### Accessing Root Context
```go
{{ range .Pages }}
    {{ $.Site.Title }}  // $ always refers to root context
{{ end }}
```

### Defining Variables
```go
{{ $title := .Title }}
{{ $count := len .Pages }}
{{ $hasPhotos := isset .Params "photos" }}
```

---

## Control Structures

### If/Else
```go
{{ if .Title }}
    <h1>{{ .Title }}</h1>
{{ else }}
    <p>Untitled post</p>
{{ end }}

// With else if
{{ if eq .Section "photos" }}
    Photo post
{{ else if eq .Section "posts" }}
    Blog post
{{ else }}
    Other content
{{ end }}
```

### With (non-empty check + context change)
```go
{{ with .Params.author }}
    <span class="author">{{ . }}</span>
{{ end }}

// With else
{{ with .Params.subtitle }}
    <h2>{{ . }}</h2>
{{ else }}
    <h2>No subtitle</h2>
{{ end }}
```

### Range (iteration)
```go
// Array/slice
{{ range .Params.photos }}
    <img src="{{ . }}">
{{ end }}

// With index
{{ range $index, $photo := .Params.photos }}
    <img src="{{ $photo }}" data-index="{{ $index }}">
{{ end }}

// Maps
{{ range $key, $value := .Params }}
    {{ $key }}: {{ $value }}
{{ end }}

// Range with else (empty collection)
{{ range .Pages }}
    <article>{{ .Title }}</article>
{{ else }}
    <p>No posts found.</p>
{{ end }}
```

---

## Functions

### String Functions
```go
{{ .Title | lower }}                    // lowercase
{{ .Title | upper }}                    // UPPERCASE  
{{ .Title | title }}                    // Title Case
{{ .Title | truncate 50 }}              // Truncate with ellipsis
{{ .Title | truncate 50 "..." }}        // Custom ellipsis
{{ .Content | plainify }}               // Strip HTML
{{ .Content | safeHTML }}               // Mark as safe HTML
{{ trim .Title " " }}                   // Trim whitespace
{{ replace .Title "old" "new" }}        // Replace substring
{{ split "a,b,c" "," }}                 // Split to slice
```

### Comparison Functions
```go
{{ eq .Section "posts" }}      // Equal
{{ ne .Title "" }}             // Not equal
{{ lt $count 10 }}             // Less than
{{ le $count 10 }}             // Less than or equal
{{ gt $count 0 }}              // Greater than
{{ ge $count 1 }}              // Greater than or equal
```

### Logical Functions
```go
{{ and (isset .Params "photos") (gt (len .Params.photos) 0) }}
{{ or .Title .Summary }}
{{ not .Draft }}
```

### Date Functions
```go
{{ .Date.Format "2006-01-02" }}                    // ISO date
{{ .Date.Format "January 2, 2006" }}               // Full date
{{ .Date.Format "Mon, 02 Jan 2006 15:04:05 MST" }} // RFC1123
{{ .Date.Format "2006-01-02T15:04:05Z07:00" }}     // ISO8601 (for datetime attr)
{{ now }}                                           // Current time
{{ dateFormat "Jan 2" .Date }}                     // Alternative syntax
```

**Note:** Go date format uses reference time: `Mon Jan 2 15:04:05 MST 2006`

### Collection Functions
```go
{{ len .Pages }}                    // Length
{{ first 5 .Pages }}                // First N items
{{ last 3 .Pages }}                 // Last N items
{{ after 2 .Pages }}                // Skip first N
{{ where .Pages "Section" "posts" }} // Filter
{{ sort .Pages "Date" "desc" }}     // Sort
{{ uniq .Tags }}                    // Remove duplicates
{{ isset .Params "photos" }}        // Check key exists
{{ default "Untitled" .Title }}     // Default value
```

### URL Functions
```go
{{ .Permalink }}           // Full URL
{{ .RelPermalink }}        // Relative URL
{{ absURL "css/style.css" }} // Absolute URL
{{ relURL "css/style.css" }} // Relative URL from string
```

### Safe Content Functions
```go
{{ .Content | safeHTML }}      // Trust HTML
{{ .URL | safeURL }}           // Trust URL
{{ $css | safeCSS }}           // Trust CSS
{{ $js | safeJS }}             // Trust JavaScript
```

---

## Partials

### Creating Partials
File: `layouts/partials/post-meta.html`
```go
<div class="meta">
    <time datetime="{{ .Date.Format "2006-01-02" }}">
        {{ .Date.Format "Jan 2, 2006" }}
    </time>
    {{ with .Params.author }}
        <span class="author">by {{ . }}</span>
    {{ end }}
</div>
```

### Calling Partials
```go
{{ partial "post-meta.html" . }}           // Pass current context
{{ partial "header.html" (dict "title" .Title "site" .Site) }}  // Pass dict
```

### Partial with Return Value
File: `layouts/partials/word-count.html`
```go
{{ $words := len (split (.Content | plainify) " ") }}
{{ return $words }}
```

Usage:
```go
{{ $count := partial "word-count.html" . }}
<span>{{ $count }} words</span>
```

### Inline Partials (define/block)
In `baseof.html`:
```go
<!DOCTYPE html>
<html>
<head>
    {{ block "head" . }}
        <title>{{ .Site.Title }}</title>
    {{ end }}
</head>
<body>
    {{ block "main" . }}{{ end }}
    {{ block "footer" . }}
        {{ partial "footer.html" . }}
    {{ end }}
</body>
</html>
```

In child template:
```go
{{ define "main" }}
    <article>{{ .Content }}</article>
{{ end }}

{{ define "head" }}
    <title>{{ .Title }} | {{ .Site.Title }}</title>
{{ end }}
```

---

## Template Lookup Order

Hugo searches for templates in this order (simplified for Micro.blog):

### Single Pages (e.g., a blog post)
1. `layouts/[section]/single.html` (e.g., `layouts/posts/single.html`)
2. `layouts/_default/single.html`

### List Pages (e.g., homepage, archives)
1. `layouts/[section]/list.html`
2. `layouts/_default/list.html`

### Homepage
1. `layouts/index.html`
2. `layouts/_default/list.html`

### Taxonomy Pages (categories, tags)
1. `layouts/[taxonomy]/list.html` (e.g., `layouts/categories/list.html`)
2. `layouts/_default/list.html`

### Understanding Types and Sections

```go
{{ .Type }}      // Content type (usually same as section)
{{ .Section }}   // Top-level directory in content/
{{ .Kind }}      // page, section, home, taxonomy, term
```

Example for photo at `/photos/2024/vacation.md`:
- `.Section` = "photos"
- `.Type` = "photos"  
- `.Kind` = "page"
