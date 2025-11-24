# Generated manually for ie-logs-new

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0003_alter_project_account_name_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='project',
            name='is_redline',
            field=models.BooleanField(default=False, help_text='Redline flag'),
        ),
        migrations.AlterField(
            model_name='project',
            name='project_status',
            field=models.CharField(blank=True, choices=[('Approve', 'Approve'), ('Conditional Approve', 'Conditional Approve'), ('Reject', 'Reject'), ('Review', 'Review')], max_length=50, null=True),
        ),
    ]
