from django import template

from django_image_gallery.models import GalleryImage

register = template.Library()


@register.inclusion_tag("django_image_gallery/gallery.html")
def gallery():
    gallery_images = GalleryImage.objects.filter(is_published=True)
    return {"gallery_images": gallery_images}