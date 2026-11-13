
import tempfile
from io import BytesIO

from PIL import Image
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from django.template import Context, Template

from django_image_gallery.models import GalleryImage


class GalleryImageTests(TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp_dir.cleanup)

        media_settings = override_settings(MEDIA_ROOT=self.temp_dir.name)
        media_settings.enable()
        self.addCleanup(media_settings.disable)

    def create_test_image(self, filename="test-image.jpg", size=(800, 600)):
        buffer = BytesIO()

        Image.new("RGB", size, color=(100, 150, 200)).save(
            buffer,
            format="JPEG",
        )

        return SimpleUploadedFile(
            filename,
            buffer.getvalue(),
            content_type="image/jpeg",
        )

    def test_create_gallery_image(self):
        image = GalleryImage.objects.create(
            title="Test Image",
            image=self.create_test_image(),
            caption="A test caption.",
        )

        self.assertEqual(image.title, "Test Image")
        self.assertEqual(image.caption, "A test caption.")
        self.assertEqual(image.sort_order, 0)
        self.assertFalse(image.is_published)
        self.assertEqual(str(image), "Test Image")

    def test_image_resizing(self):
        image = GalleryImage.objects.create(
            title="Large Image",
            image=self.create_test_image(size=(2400, 1200)),
        )

        with Image.open(image.image.path) as stored_image:
            self.assertEqual(stored_image.size, (2000, 1000))

    def test_small_images_are_not_resized(self):
        image = GalleryImage.objects.create(
            title="Small Image",
            image=self.create_test_image(size=(800, 600)),
        )

        with Image.open(image.image.path) as stored_image:
            self.assertEqual(stored_image.size, (800, 600))

    def test_gallery_image_ordering(self):
        first = GalleryImage.objects.create(
            title="First",
            image=self.create_test_image("first.jpg"),
            sort_order=1,
        )

        second = GalleryImage.objects.create(
            title="Second",
            image=self.create_test_image("second.jpg"),
            sort_order=2,
        )

        images = list(GalleryImage.objects.all())

        self.assertEqual(images, [first, second])

    def test_gallery_displays_only_published_images(self):
        GalleryImage.objects.create(
            title="Published Image",
            image=self.create_test_image("published.jpg"),
            is_published=True,
        )

        GalleryImage.objects.create(
            title="Unpublished Image",
            image=self.create_test_image("unpublished.jpg"),
            is_published=False,
        )

        template = Template(
            "{% load django_image_gallery %}{% gallery %}"
        )

        html = template.render(Context({}))

        self.assertIn("Published Image", html)
        self.assertIn("published.jpg", html)
        self.assertNotIn("Unpublished Image", html)
        self.assertNotIn("unpublished.jpg", html)
