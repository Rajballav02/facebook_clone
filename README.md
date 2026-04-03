# Facebook Clone Layout

## Aim

To design a responsive three-column web page layout similar to the Facebook profile page using Bootstrap 5 and implement dynamic user profile updates using JavaScript.

## Objective

- To learn and implement the Bootstrap 5 Grid System for multi-column layouts.
- To use Bootstrap components like Navbar, Cards, and Modals.
- To separate concerns by organizing HTML, CSS, and JavaScript into separate files.
- To implement DOM manipulation for dynamic content updates (Edit Profile feature).

## Code

### 1. HTML (`index.html`)

The main structure of the page, including the 3-column layout (Sidebar, Feed, Widgets).

```html
<!-- See index.html file for full code -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Facebook Style Layout</title>
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <!-- Navbar -->
    <nav
      class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top shadow-sm"
    >
      ...
    </nav>

    <!-- Main Content -->
    <div class="container-fluid mt-5 pt-3">
      <div class="row pt-3">
        <!-- Left Column: Sidebar -->
        <div class="col-md-3 d-none d-md-block sticky-top">...</div>

        <!-- Middle Column: Feed -->
        <div class="col-md-6 col-sm-12">...</div>

        <!-- Right Column: Contacts -->
        <div class="col-md-3 d-none d-lg-block sticky-top">...</div>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <div class="modal fade" id="editProfileModal">...</div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="script.js"></script>
  </body>
</html>
```

### 2. CSS (`style.css`)

Custom styling to mimic the Facebook visual identity (colors, spacing, shadows).

```css
body {
  background-color: #f0f2f5;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}
.navbar {
  background-color: #1877f2 !important;
}
.card {
  border-radius: 10px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
/* ... see style.css for full code ... */
```

### 3. JavaScript (`script.js`)

Logic to handle the "Edit Profile" functionality.

```javascript
function updateProfile() {
  const newName = document.getElementById("userNameInput").value;
  document.getElementById("sidebar-user-name").innerText = newName;
  // ... updates avatars and other elements ...
  alert("Profile updated successfully!");
}
```

## Output

- **Three-Column Layout**: Left sidebar with menu, central scrollable feed with posts/stories, right sidebar with contacts.
- **Respiratory**: On smaller screens, sidebars disappear/collapse, leaving the main feed.
- **Interactive**: "Edit Profile" button opens a modal. Changing the name updates it everywhere on the page instantly without reloading.

## Learning Outcome

By completing this worksheet, we have learned:

1.  **Grid System Mastery**: How to use `col-md-3`, `col-md-6` to create responsive layouts.
2.  **Component Usage**: effectively using Bootstrap Navbars, Cards, and Modals.
3.  **code Organization**: The importance of keeping styles in `.css` and logic in `.js` files for maintainability.
4.  **DOM Manipulation**: How to select elements (`document.getElementById`, `querySelector`) and update their content and attributes dynamically.
