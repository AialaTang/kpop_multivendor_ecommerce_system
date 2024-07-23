from django.shortcuts import render, redirect
from django.conf import settings


from store.models import Category, Product, Gallery,Specification,Size,Color,Cart,CartOrder,CartOrderItem,ProductFaq,Review,Wishlist,Notification,Coupon, Tax
from store.serializer import ProductSerializer, CategorySerializer, CartSerializer, CartOrderSerializer, CartOrderItemSerializer,CouponSerializer,NotificationSerializer,ReviewSerializer
from userauths.models import User

from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from decimal import Decimal

import stripe
import requests

stripe.api_key=settings.STRIPE_SECRET_KEY


def send_notification(user=None, vendor=None, order=None, order_item=None):
    Notification.objects.create(
        user=user,
        vendor=vendor,
        order=order,
        order_item=order_item
    )


class CategoryListAPIView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

class ProductListAPIView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

class ProductDetailAPIView(generics.RetrieveAPIView):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        slug = self.kwargs['slug']
        return Product.objects.get(slug=slug)

class CartAPIView(generics.ListCreateAPIView):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        payload = request.data

        product_id = payload['product_id']
        user_id = payload['user_id']
        qty = payload['qty']
        price = payload['price']
        shipping_amount=payload['shipping_amount']
        country = payload['country']
        size = payload['size']
        color = payload['color']
        cart_id = payload['cart_id']      

        product = Product.objects.get(id=product_id) 
        if user_id != "undefined":
            user = User.objects.get(id=user_id) 
        else:
            user = None


        tax = Tax.objects.filter(country=country).first()
        if tax:
            tax_rate=tax.rate/100
        else:
            tax_rate=0

        cart = Cart.objects.filter(cart_id=cart_id, product=product,user=user).first()
        if  cart:
            cart.product=product
            cart.user=user
            cart.qty=qty
            cart.price=price
            cart.sub_total=Decimal(price)*int(qty)
            cart.shipping_amount=Decimal(shipping_amount)*int(qty)
            cart.tax_fee=Decimal(price)*Decimal(tax_rate)*int(qty)
            cart.color=color
            cart.size=size
            cart.country=country
            cart.cart_id=cart_id

            service_fee_percentage=10 / 100
            cart.service_fee=Decimal(service_fee_percentage)*cart.sub_total

            cart.total=cart.sub_total+cart.shipping_amount+cart.service_fee+cart.tax_fee
            cart.save()

            return Response({'message':"Cart updated Successfully"}, status=status.HTTP_200_OK)
        else:
            cart=Cart()
            cart.product=product
            cart.user=user
            cart.qty=qty
            cart.price=price
            cart.sub_total=Decimal(price)*int(qty)
            cart.shipping_amount=Decimal(shipping_amount)*int(qty)
            cart.tax_fee=Decimal(price)*Decimal(tax_rate)*int(qty)
            cart.color=color
            cart.size=size
            cart.country=country
            cart.cart_id=cart_id

            service_fee_percentage=10 / 100
            cart.service_fee=Decimal(service_fee_percentage)*cart.sub_total

            cart.total=cart.sub_total+cart.shipping_amount+cart.service_fee+cart.tax_fee
            cart.save()
            return Response({'message':"Cart created Successfully"}, status=status.HTTP_201_CREATED)

class CartListView(generics.ListAPIView):
    serializer_class = CartSerializer
    permission_classes = [AllowAny]
    queryset = Cart.objects.all()

    def get_queryset(self):
        cart_id=self.kwargs['cart_id']
        user_id=self.kwargs.get('user_id')

        if user_id is not None:
            user=User.objects.get(id=user_id)
            queryset=Cart.objects.filter(user=user, cart_id=cart_id)
        else:
            queryset=Cart.objects.filter(cart_id=cart_id)
        
        return queryset
    
class CartDetailView(generics.RetrieveAPIView):
    serializer_class = CartSerializer
    permission_classes = [AllowAny]
    lookup_field = "cart_id"

    def get_queryset(self):
        cart_id=self.kwargs['cart_id']
        user_id=self.kwargs.get('user_id')

        if user_id is not None:
            user=User.objects.get(id=user_id)
            queryset=Cart.objects.filter(user=user, cart_id=cart_id)
        else:
            queryset=Cart.objects.filter(cart_id=cart_id)
        
        return queryset
    
    def get(self,request,*args,**kwargs):
        queryset = self.get_queryset()

        total_shipping=0.0
        total_tax=0.0
        total_service_fee=0.0
        total_sub_total=0.0
        total_total=0.0

        for cart_item in queryset:
            total_shipping += float(self.calculate_shipping(cart_item))
            total_tax += float(self.calculate_tax(cart_item))
            total_service_fee += float(self.calculate_service_fee(cart_item))
            total_sub_total += float(self.calculate_sub_total(cart_item))
            total_total += float(self.calculate_total(cart_item))

        data={
            'shipping':total_shipping,
            'tax':total_tax,
            'service_fee':total_service_fee,
            'sub_total':total_sub_total, 
            'total':total_total 
        }

        return Response(data)

    def calculate_shipping(self, cart_item):
        return cart_item.shipping_amount
    def calculate_tax(self, cart_item):
        return cart_item.tax_fee
    def calculate_service_fee(self, cart_item):
        return cart_item.service_fee
    def calculate_sub_total(self, cart_item):
        return cart_item.sub_total   
    def calculate_total(self,cart_item):
        return cart_item.total
    
class CartItemDeleteAPIView(generics.DestroyAPIView):
        serializer_class=CartSerializer
        lookup_field='cart_id'
        permission_classes=[AllowAny]

        def get_object(self):
            cart_id=self.kwargs['cart_id']
            item_id=self.kwargs['item_id']
            user_id=self.kwargs.get('user_id')
            if user_id:
             user=User.objects.get(id=user_id)
             cart=Cart.objects.get(id=item_id,cart_id=cart_id,user=user)
            else:
             cart=Cart.objects.get(id=cart_id)
            return cart

class CreateOrderAPIView(generics.CreateAPIView):
    serializer_class=CartOrderSerializer
    queryset=CartOrder.objects.all()
    permission_classes=[AllowAny]

    def create(self,request):
        payload=request.data

        full_name=payload['full_name']
        email=payload['email']
        mobile=payload['mobile']
        address=payload['address']
        city=payload['city']
        state=payload['state']
        country=payload['country']
        cart_id=payload['cart_id']
        user_id=payload['user_id']
        print("user_id===",user_id)

        try:
            user = User.objects.get(id=user_id)
        except:
            user=None
        
        print("user===",user)
        cart_items=Cart.objects.filter(cart_id=cart_id, user=user)

        total_shipping=Decimal(0.00)
        total_tax=Decimal(0.00)
        total_service_fee=Decimal(0.00)
        total_sub_total=Decimal(0.00)
        total_initial_total=Decimal(0.00)
        total_total=Decimal(0.00)

        order= CartOrder.objects.create(
            buyer=user,
            full_name=full_name,
            email=email,
            mobile=mobile,
            address=address,
            city=city,
            state=state,
            country=country,
        )
        
        for c in cart_items:
            CartOrderItem.objects.create(
                order=order,
                product=c.product,
                vendor=c.product.vendor,
                qty=c.qty,
                color=c.color,
                size=c.size,
                price=c.price,
                sub_total=c.sub_total,
                service_fee=c.service_fee,
                tax_fee=c.tax_fee,
                total=c.total,
                initial_total=c.total
            )

            total_shipping += Decimal(c.shipping_amount)
            total_tax += Decimal(c.tax_fee)
            total_service_fee += Decimal(c.service_fee)
            total_sub_total += Decimal(c.sub_total)
            total_initial_total += Decimal(c.total)
            total_total += Decimal(c.total)

            order.vendor.add(c.product.vendor)

        order.sub_total=total_sub_total
        order.shipping_amount=total_shipping
        order.service_fee=total_service_fee
        order.tax_fee=total_tax
        order.total=total_total
        order.initial_total=total_initial_total

        order.save()

        return Response({"message":"Order Created Successfully","order_oid":order.oid}, status=status.HTTP_201_CREATED)

class CheckoutView(generics.RetrieveAPIView):
    serializer_class=CartOrderSerializer
    lookup_field='order_oid'
    permission_classes=[AllowAny]

    def get_object(self):
        order_oid=self.kwargs['order_oid']
        order=CartOrder.objects.get(oid=order_oid)
        return order

class CouponAPIView(generics.CreateAPIView):
    serializer_class=CouponSerializer
    queryset=Coupon.objects.all()
    permission_classes=[AllowAny]

    def create(self,request):
        payload=request.data

        order_oid=payload['order_oid']
        coupon_code=payload['coupon_code']

        order=CartOrder.objects.get(oid=order_oid)
        coupon=Coupon.objects.filter(code=coupon_code).first()

        if coupon:
            order_items=CartOrderItem.objects.filter(order=order,vendor=coupon.vendor)
            if order_items:
                for i in order_items:
                    if not coupon in i.coupon.all():
                        discount=i.total * coupon.discount/100

                        i.total -= discount
                        i.sub_total -= discount
                        i.coupon.add(coupon)
                        i.saved += discount

                        order.total -= discount
                        order.sub_total -= discount
                        order.saved += discount

                        i.save()
                        order.save()

                        return Response({"message":"Coupon Activated","icon":"success"}, status=status.HTTP_200_OK)
                    else:
                        return Response({"message":"Coupon Already Activated","icon":"warning"}, status=status.HTTP_200_OK)
            else:
                return Response({"message":"Order Item Does Not Exixts","icon":"error"}, status=status.HTTP_200_OK)
        else:
            return Response({"message":"Coupon Does Not Exixts","icon":"error"}, status=status.HTTP_200_OK)

class StripeCheckoutView(generics.CreateAPIView):
    serializer_class=CartOrderSerializer
    perission_classes=[AllowAny]
    queryset=CartOrder.objects.all()

    def create(self,*args,**kwargs):
        order_oid=self.kwargs['order_oid']
        order=CartOrder.objects.get(oid=order_oid)

        if not order:
            return Response({"message":"Order Not Found"}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            checkout_session=stripe.checkout.Session.create(
                customer_email=order.email,
                payment_method_types=['card'],
                line_items=[
                    {
                        'price_data':{
                        'currency':'aud',
                        'product_data':{
                            'name':order.full_name,
                        },
                        'unit_amount':int(order.total * 100)
                    },
                    'quantity':1,
                    }
                ],
                mode='payment',

               success_url=f'http://localhost:5173/payment-success/' + order.oid + '?session_id={CHECKOUT_SESSION_ID}',
               cancel_url=f'http://localhost:5173/payment-failed/?session_id={{CHECKOUT_SESSION_ID}}' ,
            )
            order.stripe_session_id=checkout_session.id
            order.save()
            return redirect(checkout_session.url)
        
        except stripe.error.StripeError as e:
            return Response({'error':f'Something went wrong when creating stripe checkout sessiom:{str(e)}'},status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def get_access_token(client_id, secret_id):
    token_url = 'https://api.sandbox.paypal.com/v1/oauth2/token'
    data = {'grant_type':'client_credentials'}
    auth = (client_id, secret_id)
    response = requests.post(token_url,data=data, auth=auth)
    if response.status_code==200:
        print("Access Token", response.json()['access_token'])
        return response.json()['access_token']
    else:
        raise Exception(f"Failed to get access token:{response.status_code}")


class PaymentSuccessView(generics.CreateAPIView):
    serializer_class=CartOrderSerializer
    permission_classes=[AllowAny]
    queryset=CartOrder.objects.all()

    def create(self,request,*args,**kwargs):
        payload=request.data

        order_oid=payload['order_oid']
        session_id=payload['session_id']
        paypal_order_id=payload['paypal_order_id']

        order=CartOrder.objects.get(oid=order_oid)
        order_items=CartOrderItem.objects.filter(order=order)

        #Paypal Payment
        
        if paypal_order_id != 'null':
            paypal_api_url=f'https://api-m.sandbox.paypal.com/v2/checkout/orders/{paypal_order_id}'
            headers={
                'Content-Type':'application/json',
                'Authorization':f'Bearer {get_access_token(settings.PAYPAL_CLIENT_ID,settings.PAYPAL_SECRET_ID)}'
            }

            response=requests.get(paypal_api_url, headers=headers)

            if response.status_code=='200':
                paypal_order_data=response.json()
                paypal_payment_status=paypal_order_data['status']
                if paypal_payment_status=="COMPLETED":
                    if order.payment_status == "processing":
                        order.payment_status = 'paid'
                        order.save()
                        #Send Notifications to customers
                        if order.buyer != None:
                            send_notification(user=order.buyer,order=order)
                        #Send Notifications to vendors
                        for o in order_items:
                            send_notification(vendor=o.vendor,order=order,order_item=o)
                            
                        #Send Emails To Buyer

                        #Send Emails To Ve ndors

                        return Response({"message":"Payment Successful"})
                    else:
                        return Response({"message":"Already Paid"})
            else:
               return Response({"message":"Your Invoice was cancelled"})
                
        #Stripe Payment
        if session_id != 'null':
            session=stripe.checkout.Session.retrieve(session_id)

            if session.payment_status =='paid':
                if order.payment_status == "pending":
                    order.payment_status = 'paid'
                    order.save()

                    #Send Notifications to customers
                    if order.buyer != None:
                        send_notification(user=order.buyer,order=order)
                    #Send Notifications to vendors
                    for o in order_items:
                        send_notification(vendor=o.vendor,order=order,order_item=o)
                    #Send Emails To Buyer

                    #Send Emails To Ve ndors

                    return Response({"message":"Payment Successful"},status=status.HTTP_201_CREATED)

                else:
                    return Response({"message":"Already Paid"},status=status.HTTP_201_CREATED)
                
            elif session.payment_status =='unpaid':
                return Response({"message":"Your Invoice is Unpaid"},status=status.HTTP_402_PAYMENT_REQUIRED)
            
            elif session.payment_status =='cancelled':
                return Response({"message":"Your Invoice was cancelled"},status=status.HTTP_403_FORBIDDEN)
            
            else:
                return Response({"message":"An Error Occured, Try Again..."},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        else:
            session = None
               

class ReviewListAPIView(generics.ListCreateAPIView):
    queryset=Review.objects.all()
    serializer_class=ReviewSerializer
    permission_classes=[AllowAny]

    def get_queryset(self):
        product_id=self.kwargs['product_id']

        product=Product.objects.get(id=product_id)
        reviews=Review.objects.filter(product=product)
        return reviews
    
    def create(self,request,*args,**kwargs):
        payload=request.data 

        user_id=payload['user_id']
        product_id=payload['product_id']
        rating=payload['rating']
        review=payload['review']

        user=User.objects.get(id=user_id)
        product=Product.objects.get(id=product_id)
        
        if user:
            
            Review.objects.create(
                
                user=user,
                product=product,
                rating=rating,
                review=review
            )

            return Response({"message":"Review Created Successfully"}, status=status.HTTP_200_OK )
    
        else:
            return Response({"message":"Not Logged In"}, status=status.HTTP_200_OK )


class SearchProductAPIView(generics.ListCreateAPIView):
    serializer_class=ProductSerializer
    permission_classes=[AllowAny]

    def get_queryset(self):
        query=self.request.GET.get("query")
        products=Product.objects.filter(status='published', title__icontains=query)
        return products


        
        


        

        

