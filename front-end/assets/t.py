import cv2 as cv

img = cv.imread("location-original.png")
cv.imwrite("location-original-bgr.png", cv.cvtColor(img, cv.COLOR_BGR2RGB))