from django.shortcuts import render

# Create your views here.


def startGame(request):
    return render(request, 'game/homepage.html')