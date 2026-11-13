# Django Image Gallery

An image gallery application for Django projects. Provides an easy way to manage, organize, and display images through the Django admin interface and a reusable template tag.

## Features

- Django model for managing gallery images
- Automatic resizing of uploaded images exceeding 2000 × 2000 pixels
- Published and unpublished image management
- Configurable image ordering
- Masonry image layout
- Load-more functionality
- Full-screen image viewer
- Django admin integration
- Reusable template tag

## Requirements

- Python 3.10+
- Django 5.2, 6.0, or 6.1
- Pillow 10.0 or later

## Installation

Install the package using pip:

```bash
pip install django-image-gallery
```

## Configuration

Add `django_image_gallery` to your project's `INSTALLED_APPS`:

```python
INSTALLED_APPS = [
    # ...
    "django_image_gallery",
]
```

Run the database migrations:

```bash
python manage.py migrate
```

## Usage

Load the template tag library and include the gallery wherever you want it displayed:

```django
{% load django_image_gallery %}

{% gallery %}
```

The template tag retrieves all published gallery images and renders them using the package's included gallery template.

## Media Configuration

Configure Django to handle uploaded media files:

```python
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"
```

During local development, you can serve media files through Django by adding the following to your project's root `urls.py`:

```python
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Your URL patterns
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

For production deployments, configure your web server or storage backend to serve uploaded media files. Uploaded images must be accessible through the configured media storage.

## Managing Images

Images can be added and managed through the Django admin interface.

After creating a superuser:

```bash
python manage.py createsuperuser
```

Log in to the admin interface and locate **Gallery Images**.

Each image supports the following fields:

| Field | Description |
|---|---|
| Title | Optional image title |
| Image | Uploaded image file |
| Caption | Optional image caption |
| Sort order | Controls the display order of images |
| Published | Determines whether the image appears in the gallery |

Only published images appear in the gallery. Images are ordered by `sort_order`, with newer entries taking precedence when sort orders match.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.