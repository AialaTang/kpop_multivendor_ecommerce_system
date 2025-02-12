# Generated by Django 4.2.7 on 2024-05-25 04:38

from django.db import migrations, models
import shortuuid.django_fields


class Migration(migrations.Migration):

    dependencies = [
        ('store', '0006_alter_product_rating'),
    ]

    operations = [
        migrations.CreateModel(
            name='Tax',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('country', models.CharField(max_length=100)),
                ('rate', models.IntegerField(default=5, help_text='Numbers added here are in percentage e.g 5%')),
                ('active', models.BooleanField(default=True)),
                ('date', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.AlterField(
            model_name='cartorder',
            name='oid',
            field=shortuuid.django_fields.ShortUUIDField(alphabet='bcdefghijklmnopqrstuvwxyz', length=5, max_length=10, prefix='KP', unique=True),
        ),
        migrations.AlterField(
            model_name='cartorderitem',
            name='oid',
            field=shortuuid.django_fields.ShortUUIDField(alphabet='bcdefghijklmnopqrstuvwxyz', length=5, max_length=10, prefix='KP', unique=True),
        ),
        migrations.AlterField(
            model_name='gallery',
            name='gid',
            field=shortuuid.django_fields.ShortUUIDField(alphabet='bcdefghijklmnopqrstuvwxyz', length=5, max_length=10, prefix='KP', unique=True),
        ),
        migrations.AlterField(
            model_name='product',
            name='pid',
            field=shortuuid.django_fields.ShortUUIDField(alphabet='bcdefghijklmnopqrstuvwxyz', length=5, max_length=10, prefix='KP', unique=True),
        ),
    ]
