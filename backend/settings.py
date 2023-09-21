"""
Django settings for backend project.

Generated by 'django-admin startproject' using Django 4.2.4.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

from pathlib import Path
# added for JWT customization in SIMPLE_JWT = {} below
from datetime import timedelta

# importing os library to be able to access the built of the front-end part
# in the TEMPLATES 'DIRS'
import os

# imported for usage in secret keys
import secrets

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get(
    "DJANGO_SECRET_KEY",
    default=secrets.token_urlsafe(nbytes=64),
)

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True
# while pushing it LIVE to HEROKU
# DEBUG = False

ALLOWED_HOSTS = ['*'
                 # '127.0.0.1',
                 # 'localhost',

                 # # this is the heroku app link
                 # "https://mravolak-bookshop-ccd79b877dad.herokuapp.com",
                 # "https://web-production-2b33.up.railway.app",
                 ]


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',

    "whitenoise.runserver_nostatic",
    'django.contrib.staticfiles',

    # after the pip install djangorestframework we need to add this in order for it to work
    'rest_framework',

    "corsheaders",  # linked with pip install django-cors-headers

    'storages',  # storage linked with AWS S3 buchet storage

    'base.apps.BaseConfig',  # we point at the Config class found in our app_name/apps.py
    # we use base.apps.BaseConfig, so that it goes into base/apps.py folder and connects/start using the signals
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(days=30),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "ROTATE_REFRESH_TOKENS": False,
    "BLACKLIST_AFTER_ROTATION": False,
    "UPDATE_LAST_LOGIN": False,

    "ALGORITHM": "HS256",
    # "SIGNING_KEY": settings.SECRET_KEY,
    "VERIFYING_KEY": "",
    "AUDIENCE": None,
    "ISSUER": None,
    "JSON_ENCODER": None,
    "JWK_URL": None,
    "LEEWAY": 0,

    "AUTH_HEADER_TYPES": ("Bearer",),
    "AUTH_HEADER_NAME": "HTTP_AUTHORIZATION",
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
    "USER_AUTHENTICATION_RULE": "rest_framework_simplejwt.authentication.default_user_authentication_rule",

    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
    "TOKEN_TYPE_CLAIM": "token_type",
    "TOKEN_USER_CLASS": "rest_framework_simplejwt.models.TokenUser",

    "JTI_CLAIM": "jti",

    "SLIDING_TOKEN_REFRESH_EXP_CLAIM": "refresh_exp",
    "SLIDING_TOKEN_LIFETIME": timedelta(minutes=5),
    "SLIDING_TOKEN_REFRESH_LIFETIME": timedelta(days=1),

    # It will work instead of the default serializer(TokenObtainPairSerializer).
    "TOKEN_OBTAIN_SERIALIZER": "base.serializers.MyTokenObtainPairSerializer",

    "TOKEN_REFRESH_SERIALIZER": "rest_framework_simplejwt.serializers.TokenRefreshSerializer",
    "TOKEN_VERIFY_SERIALIZER": "rest_framework_simplejwt.serializers.TokenVerifySerializer",
    "TOKEN_BLACKLIST_SERIALIZER": "rest_framework_simplejwt.serializers.TokenBlacklistSerializer",
    "SLIDING_TOKEN_OBTAIN_SERIALIZER": "rest_framework_simplejwt.serializers.TokenObtainSlidingSerializer",
    "SLIDING_TOKEN_REFRESH_SERIALIZER": "rest_framework_simplejwt.serializers.TokenRefreshSlidingSerializer",
}

MIDDLEWARE = [

    # linked with pip install django-cors-headers
    "corsheaders.middleware.CorsMiddleware",
    # inserted before CommonMiddleware

    'django.middleware.security.SecurityMiddleware',

    # adding whitenoise middleware just below SecurityMiddleware
    'whitenoise.middleware.WhiteNoiseMiddleware',

    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, 'frontend/dist')
        ],  # setting the route to the index.html location
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

# old sqlite3 version
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',
#     }
# }

# local postgres version
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': 'bookshop',
#         'USER': 'postgres',
#         'PASSWORD': '123',
#         'HOST': 'localhost',
#         'PORT': '5433'
#     }
# }

# AWS postgres version
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'bookshop',
        'USER': 'vikadie',
        'PASSWORD': os.environ.get('DB_PASS'),
        'HOST': 'bookshop-identifier.cuzbdwwwlaoy.eu-north-1.rds.amazonaws.com',
        'PORT': '5432'
    }
}

# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = 'static/'

MEDIA_URL = '/images/'

STATICFILES_DIRS = [
    BASE_DIR / 'static',

    # adding the static files of the React built project as static to the Django project as well
    # to be able to use it inside the index.html configured as template in urls.py
    # renamed folder "assets" to "static"
    BASE_DIR / 'frontend/dist/static'
]

# config MEDIA_ROOT
MEDIA_ROOT = 'static/images'

# configuring staticfiles in production mode (DEBUG = False)
STATIC_ROOT = BASE_DIR / 'staticfiles'

# repacing MEDIA_ROOT and STATIC_URL by Amazon S3 bucket storage
STORAGES = {
    "default": {
        "BACKEND": "storages.backends.s3.S3Storage",
        "OPTIONS": {},
    },
    "staticfiles": {
        # general static folder storage
        # "BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage",
        # staticfolder storage useing whitenoise
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
        "OPTIONS": {},
    },
}


# Don't store the original (un-hashed filename) version of static files, to reduce slug size:
# https://whitenoise.readthedocs.io/en/latest/django.html#WHITENOISE_KEEP_ONLY_HASHED_FILES
WHITENOISE_KEEP_ONLY_HASHED_FILES = True

# user information
AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')
# request not to share the Auth query string with each link
AWS_QUERYSTRING_AUTH = False
# aws bucket name
AWS_STORAGE_BUCKET_NAME = 'bookshop-bucket'


# CORS
# CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    # this is the heroku app link
    "https://mravolak-bookshop-ccd79b877dad.herokuapp.com",
    "https://web-production-2b33.up.railway.app",

    # this is Amazon server:
    "https://mravolak.mine.bz",
    "https://16.170.82.213"
]

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# checking if the current working directory should be on production in HEROKU it will equal '/app'
if os.getcwd() == '/app':
    DEBUG = False

print('DEBUG is', DEBUG)
# LOGGING = {
#     'version': 1,
#     'disable_existing_loggers': True,
#     # 'disable_existing_loggers': False,
#     'filters': {
#         'require_debug_false': {
#             '()': 'django.utils.log.RequireDebugFalse',
#         },
#         'require_debug_true': {
#             '()': 'django.utils.log.RequireDebugTrue',
#         },
#     },
#     'formatters': {
#         'django.server': {
#             '()': 'django.utils.log.ServerFormatter',
#             'format': '[{server_time}] {message}',
#             'style': '{',
#         }
#     },
#     'handlers': {
#         'console': {
#             'level': 'INFO',
#             # 'filters': ['require_debug_true'],
#             'class': 'logging.StreamHandler',
#         },
#         'django.server': {
#             'level': 'INFO',
#             'class': 'logging.StreamHandler',
#             'formatter': 'django.server',
#         },
#         'mail_admins': {
#             'level': 'ERROR',
#             # 'filters': ['require_debug_false'],
#             'class': 'django.utils.log.AdminEmailHandler'
#         }
#     },
#     'loggers': {
#         'django': {
#             'handlers': ['console', 'mail_admins'],
#             'level': 'INFO',
#         },
#         'django.server': {
#             'handlers': ['django.server'],
#             'level': 'INFO',
#             'propagate': False,
#         },
#     }
# }
