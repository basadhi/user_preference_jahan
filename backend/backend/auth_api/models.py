from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)

class UserPreferences(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='preferences')

    name = models.CharField(max_length=20, default=)
    
    # Theme Settings
    theme = models.CharField(max_length=20, default='light')
    font_family = models.CharField(max_length=50, default='Arial, sans-serif')
    primary_color = models.CharField(max_length=20, default='#1CA1C1')
    animations_enabled = models.BooleanField(default=True)
    
    # Notification Settings
    email_notifications = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=False)
    push_notifications = models.BooleanField(default=False)
    notification_sound = models.BooleanField(default=True)
    notification_vibration = models.BooleanField(default=True)
    notification_light = models.BooleanField(default=True)
    
    # Privacy Settings
    profile_pic_visibility = models.CharField(max_length=20, default='everyone')
    profile_pic_download = models.CharField(max_length=20, default='everyone')
    account_privacy = models.CharField(max_length=20, default='public')
    connection_requests = models.CharField(max_length=20, default='everyone')
    search_engine_visibility = models.BooleanField(default=True)
    third_party_access = models.BooleanField(default=False)
    active_status_visibility = models.BooleanField(default=True)
    profile_view_tracking = models.BooleanField(default=True)
    data_retention = models.CharField(max_length=20, default='1_month')
    data_export = models.CharField(max_length=20, default='full')
    
    def __str__(self):
        return f"{self.user.username}'s preferences"
    
    def to_dict(self):
        return {
            'theme': self.theme,
            'font_family': self.font_family,
            'primary_color': self.primary_color,
            'animations_enabled': self.animations_enabled,
            'email_notifications': self.email_notifications,
            'sms_notifications': self.sms_notifications,
            'push_notifications': self.push_notifications,
            'notification_sound': self.notification_sound,
            'notification_vibration': self.notification_vibration,
            'notification_light': self.notification_light,
            'profile_pic_visibility': self.profile_pic_visibility,
            'profile_pic_download': self.profile_pic_download,
            'account_privacy': self.account_privacy,
            'connection_requests': self.connection_requests,
            'search_engine_visibility': self.search_engine_visibility,
            'third_party_access': self.third_party_access,
            'active_status_visibility': self.active_status_visibility,
            'profile_view_tracking': self.profile_view_tracking,
            'data_retention': self.data_retention,
            'data_export': self.data_export
        }