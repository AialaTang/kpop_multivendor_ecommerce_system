from django.contrib import admin
from store.models import Product, Category, Gallery, Specification, Size, Color,Cart, CartOrder,CartOrderItem, ProductFaq, Review, Wishlist, Notification, Coupon, Tax

class GalleryInline(admin.TabularInline):
    model=Gallery
    extra=0
    
class SpecificationInline(admin.TabularInline):
    model=Specification
    extra=0

class SizeInline(admin.TabularInline):
    model=Size
    extra=0

class ColorInline(admin.TabularInline):
    model=Color
    extra=0


class ProductAdmin(admin.ModelAdmin):
    list_display=['title','price','category','shipping_amount','stock_qty','in_stock','vendor','featured']
    list_editable=['featured']
    list_filter=['date']
    search_fields=['title']
    inlines=[GalleryInline,SpecificationInline,SizeInline,ColorInline]

class CartAdmin(admin.ModelAdmin):
    list_display=['cart_id',"product",'user']


class CartOrderAdmin(admin.ModelAdmin):
    list_display=['oid','buyer']

class CartOrderItemAdmin(admin.ModelAdmin):
    list_display=['vendor','product']


class ProductFaqAdmin(admin.ModelAdmin):
    list_display=['user','product']


class ReviewAdmin(admin.ModelAdmin):
    list_display=['user','product']

class WishListAdmin(admin.ModelAdmin):
    list_display=['user','product']

class NotificationAdmin(admin.ModelAdmin):
    list_display=['user','vendor','order','order_item']

class CartOrderAdmin(admin.ModelAdmin):
    list_display=['oid','payment_status','total','buyer']


admin.site.register(Category)
admin.site.register(Product,ProductAdmin)
admin.site.register(Cart,CartAdmin)
admin.site.register(CartOrder,CartOrderAdmin)
admin.site.register(CartOrderItem,CartOrderItemAdmin)
admin.site.register(ProductFaq,ProductFaqAdmin)
admin.site.register(Review,ReviewAdmin)
admin.site.register(Wishlist,WishListAdmin)
admin.site.register(Notification, NotificationAdmin)
admin.site.register(Coupon)
admin.site.register(Tax)
