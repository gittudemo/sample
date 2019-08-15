import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { Batch } from '../Batch Number/Batches';
import { Storage } from '@ionic/storage';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  //declaration of variables needed

  batches: Array<Batch> = [];
  options: BarcodeScannerOptions;
  barcodeData: string = "";
  batchNumber: any;
  pickupType: string = "pickup";
  weight = 0;
  totalWeight = 0;
  shipmentType: any = " ";
  awbNumber: any = "";
  destCode: any = "";
  count: number = 0;
  totalWeightB = 0;
  totalWeightAll = 0;
  totalWeightB1 = 0;
  batchNumberToShow: 0;
  volumetricWeight: any = {
    height: '',
    length: '',
    width: ''
  }

  details: Array<any> = [];



  constructor(public navCtrl: NavController,
    private storage: Storage,
    private toastCtrl: ToastController,
    private barcodeScanner: BarcodeScanner
  ) {
    this.pickupType = 'pickup';
  }

  async scanBarcode() {

    this.barcodeScanner.scan({
      showTorchButton: true
    }).then(barcodeData => {

      this.storage.get(this.batchNumber).then((val) => {

        if (val.filter(i => i.awbNumber === barcodeData.text).length === 0) {
          this.awbNumber = this.barcodeData;
        } else {
          alert("AWB number exist");
        }


      }).catch(err => {
        console.log('Error', err);
      })
    })
  }
  save() {

    let height = this.volumetricWeight.height ? parseFloat(this.volumetricWeight.height) : 0;

    let length = this.volumetricWeight.length ? parseFloat(this.volumetricWeight.length) : 0;

    let width = this.volumetricWeight.width ? parseFloat(this.volumetricWeight.width) : 0;

    this.totalWeight = ((height * length * width) / 5000);


    // sum of the total Weights goes here


    let saveRecord = {
      batchNumber: this.batchNumber,
      shipmentType: this.shipmentType,
      awbNumber: this.awbNumber,
      destCode: this.destCode,
      weight: this.weight,

      theight: height,
      tlength: length,
      twidth: width,
      totalWeight: this.totalWeight,
      totalWeightB: this.totalWeightB,
      totalWeightAll: this.totalWeightAll

    }


    this.saveToStorage(saveRecord)
  }


  saveToStorage(newRecords) {
    let recordsToBeSaved = [];
    if (this.batchNumber)
      this.storage.get(this.batchNumber).then((val) => {

        if (val)
        {
          if(val.filter(i => i.awbNumber === this.awbNumber).length === 1)
          {
             alert('AWb Already Present')
 
           }
         else if (val.filter(i => i.awbNumber === this.awbNumber).length === 0  )
          {
             //values are stored in the array
             recordsToBeSaved = [...val];
             //pushing new records got at the end
             recordsToBeSaved.push(newRecords);
             console.log(recordsToBeSaved);
             this.storage.set(this.batchNumber, recordsToBeSaved);
             this.showBasicToast('Record Saved')
           }
        } 
        else {
            recordsToBeSaved.push(newRecords);
            console.log(recordsToBeSaved);
            this.storage.set(this.batchNumber, recordsToBeSaved);
            this.showBasicToast('Record Saved')
          }
      })

  }

  showBasicToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000
    })
    toast.present();
  }

  showall() {
    debugger;
    if (this.batchNumber == '' || this.batchNumber == undefined) {
      setTimeout(() => {
        this.pickupType = "pickup";
      }, 100)
      this.showBasicToast('Please enter batch number and then press show Items')
    }
    else {
      this.clearArray();
      // this.storage.forEach((value, key, index) => {
      //   if (key == this.batchNumber) {
      //     console.log("This is the value", value)
      //     console.log("from the key", key)
      //     this.details.push(value);
      //     console.log("Index is", index)
      //   }
      // })

      this.storage.get(this.batchNumber).then((val) => {
        let weigh = 0;
        this.batchNumberToShow = this.batchNumber;
        if (val) {
          this.details = val;

          for (var i = 0; i < this.details.length; i++) {

            console.log(this.details[i].totalWeight, this.details[i].weight);
            if (this.details[i].totalWeight > this.details[i].weight) {
              weigh += (+this.details[i].totalWeight);
            } else {
              weigh += (+this.details[i].weight);
            }
          }
        }
        console.log(this.totalWeightB1);
        this.totalWeightAll = weigh;
      });

    }

  }

  clearArray() {
    this.details = [];
  }


  //console.log("Selected:",driverCode);

  //this.driverRider = driverCode;

  //console.log("Selected:",driverRider);

  //store the values in the storage

  saveDetails(batches: Batch) {

    console.log("Done")


  }
  //this.count = this.awbNumber.length(To count the number of specific or particular awb numbers)
  //totaladdedWeight = (total added weight in a particular batch)

}
