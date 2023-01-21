from django.contrib.auth import views as auth_views
from django.urls import path
from . import views


urlpatterns = [
    path('',views.frontpage,name = 'frontpage'),
    path('login/',auth_views.LoginView.as_view(template_name='core/login.html'),name="login"),

    path('signup/',views.signup,name='signup'),
]