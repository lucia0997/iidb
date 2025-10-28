from apps.users.views import UserViewSet
from apps.authorization.views import GroupListView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r"users", UserViewSet, basename="user")
router.register(r"groups", GroupListView, basename="group")

urlpatterns = router.urls
