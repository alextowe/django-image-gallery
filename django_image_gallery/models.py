from PIL import Image
from django.db import models


class GalleryImage(models.Model):
    title = models.CharField(max_length=200, blank=True)
    image = models.ImageField(upload_to="gallery/")
    caption = models.TextField(blank=True)
    sort_order = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        img = Image.open(self.image.path)

        max_size = (2000, 2000)

        if img.width > max_size[0] or img.height > max_size[1]:
            img.thumbnail(max_size)

        img.save(self.image.path, quality=85, optimize=True)

    class Meta:
        ordering = ["sort_order", "-id"]
        verbose_name = "Gallery Image"

    def __str__(self):
        return self.title or f"Image {self.id}"