
import cv2
import numpy as np
import time
import os
import glob
import sys
workingFolder, filename = os.path.split(os.path.abspath(__file__))

def main():
  
    inputImages = []
    logImages = []
    inputFolder = workingFolder +"/images/input/*.jpg"
    logsFolder = workingFolder + "/images/logs/*.jpg"

    files = glob.glob(workingFolder +"/images/logs/*") #clear logs folder
    for f in files:
        os.remove(f)

    for file in glob.glob(inputFolder):
        inputImages.append(file)


    index = 0
    if (len(inputImages) > 0):
        for path in inputImages:
            try:
                index += 1

                # hardcoded values to crop image, x, y are left corners where cropping starts 
                #x = 333
                #y = 177
                #h = 24
                #w = 134

                img = cv2.imread(path)
                img_inverted = cv2.bitwise_not(img)
                     
                cv2.rectangle(img_inverted, (0, 0), (640, 179), (255,255,255), cv2.FILLED)
                cv2.rectangle(img_inverted, (0, 203), (640, 480), (255,255,255), cv2.FILLED)

                cv2.rectangle(img_inverted, (0, 176), (332, 480), (255,255,255), cv2.FILLED)
                cv2.rectangle(img_inverted, (465, 176), (640, 480), (255,255,255), cv2.FILLED)
                

                im_gray = cv2.cvtColor(img_inverted, cv2.COLOR_BGR2GRAY)
                im_gray = cv2.GaussianBlur(im_gray, (5, 5), 0)
                
                # Threshold the image
                im_th = cv2.adaptiveThreshold(im_gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 15,15)     
             
                cv2.imwrite(workingFolder +'/images/logs/cropped-%s.jpg' %index ,im_th) 

                print "ok"
                sys.stdout.flush()     
                #cv2.imshow('readingImage',im_th)
                #cv2.waitKey(0)
                #cv2.destroyAllWindows()
            except Exception as e: 
                print(e)
                sys.stdout.flush()

        for file in glob.glob(logsFolder):
            logImages.append(file)

        """  if (len(logImages) > 0):
            for path in logImages:
                finalImg = cv2.imread(path)  
              
        else:
            print("No images found on logs folder")     """     
    else:
        print("No images found on input folder")
        sys.stdout.flush()

if __name__=='__main__':
    main()
   	
