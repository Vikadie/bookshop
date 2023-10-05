from django.urls import path
from ..views import user_views as views


urlpatterns = [
    # other routes
    path("login/", views.MyTokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    path("googleLogin/", views.googleLoginUser, name="google-login"),
    path("FBLogin/", views.facebookLogin, name="facebook-login"),
    path("register/", views.registerUser, name="register"),
    path("profile/", view=views.getUserProfile, name="users-profile"),
    path("profile/update/", view=views.updateUserProfile,
         name="users-profile-update"),
    path("confirmation/<str:key>/", view=views.confirmation,
         name="new-user-confirmation"),

    # admin routes
    path("", view=views.getUsers, name="users"),
    path("delete/<str:pk>/", view=views.deleteUser, name="delete-user"),
    path("update/<str:pk>/", view=views.updateUser, name="update-user"),
    # move this one down in the hierarchy not to mwss up with any of the above for <str:pk>
    path("<str:pk>/", view=views.getUserById, name="get-user"),
]
