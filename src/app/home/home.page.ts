import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LoadingController, MenuController } from '@ionic/angular';
import { RangeCustomEvent } from '@ionic/angular';

declare var google;
interface Marker {
  position: {
    lat: number,
    lng: number,
  };
  title: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  API_URL = "https://api.bsmsa.eu/ext/api/Aparcaments/ParkingService/Parkings/v3/ParkingDataSheet"
  map = null;
  markers: Marker[] = [

  ];
  vehiculo: any;
  lastEmittedValueLower: any;
  lastEmittedValueUpper: any;

  toggleFilter: boolean = false;
  mark_desde_list: boolean = false;
  parking_selected: boolean = false;
  shit_error: boolean = false;
  Num_array: any;
  array_markers: Array<any> = [];
  repeat_lengh: boolean = false;
  Parkings: any;
  Parking: any;
  Num_total_parkings: any
  list = document.getElementsByClassName("list")[0];
  titol: String;
  adress: String;
  price: String;
  handicap: String;
  wc: String;
  carcharge: String;
  consigna: String;
  carsharing: String;
  agilPark: String;
  link_google: String;
  //filtros
  filter_handicap_access: boolean = false;
  filter_wc: boolean = false;
  filter_elec_charger: boolean = false;
  filter_consigna: boolean = false;
  filter_carsharing: boolean = false;
  filter_agilPark: boolean = false;


  constructor( private http: HttpClient, private loadingCtrl: LoadingController, private menu: MenuController) {

  }

  ngOnInit() {
    this.showLoading();
    this.getAPI();

  }

  getAPI() {
    this.http.get(this.API_URL)
      .subscribe(Data => {

        // If response comes hideloader() function is called
        // to hide that loader
        /*         if (Data) {
                } */
        console.log(Data)
        this.Parkings = Data;
        this.Parking = this.Parkings.ParkingList.Parking
        this.Num_total_parkings = this.Parking.length;
        console.log(this.Num_total_parkings);
        this.loadMap();

      });
  }




  loadMap() {
    // create a new map by passing HTMLElement
    const mapEle: HTMLElement = document.getElementById('map');
    // create LatLng object
    const myLatLng = { lat: 41.41229439286, lng: 2.16836468713 };
    // create map
    this.map = new google.maps.Map(mapEle, {
      center: myLatLng,
      zoom: 12
    });

    google.maps.event.addListenerOnce(this.map, 'idle', () => {

      mapEle.classList.add('show-map');
    });
    this.get_posicions_parking();
  }

  get_posicions_parking() {

    var Latitude;
    var Longitude;
    var Name;
    //s'agafa l'array de la api
    for (let i = 0; i < this.Num_total_parkings; i++) {
      this.repeat_lengh = false;

      if (this.Parking[i].ParkingAccess != null) {
        var Parking_access_lenght = this.Parking[i].ParkingAccess.Access.length;
        //si el valor es undefined agafara els valors que no tenen array
        if (Parking_access_lenght == undefined) {
          Latitude = this.Parking[i].ParkingAccess.Access.Latitude;
          Longitude = this.Parking[i].ParkingAccess.Access.Longitude;
          Name = this.Parking[i].Name;
          this.Num_array = i;
          this.mark_parkings_map(Latitude, Longitude, Name, this.Num_array);
        } else {

          for (let j = 0; j < 1; j++) {
            Latitude = this.Parking[i].ParkingAccess.Access[j].Latitude;
            Longitude = this.Parking[i].ParkingAccess.Access[j].Longitude;
            Name = this.Parking[i].Name;
            this.Num_array = i;

            this.mark_parkings_map(Latitude, Longitude, Name, this.Num_array);
            this.repeat_lengh = true;
          }
        }
      } else {
        console.log("aye");
      }
    }
    //this.loadingCtrl.dismiss();


    this.parkings_afegits_manualment();
    this.llistar_parkings();
  }
  parkings_afegits_manualment() {
    const parkings = [
      ["PALAMOS BLOC G 50", 41.44926970747312, 2.186085047883334, 88],
      ["TAMARIU BLOC B 20", 41.44989687905624, 2.1850552958040015, 89],
      ["PALAMOS BLOC C 69-73", 41.45085231024986, 2.18685963575184, 90],
      ["Aiguablava / Vila-real", 41.45112566716934, 2.185301852560967, 91],
      ["GUSTAU GILI", 41.386091676130974, 2.147566509767769, 92],
    ];
    for (let i = 0; i < parkings.length; i++) {
      const park = parkings[i];
      this.mark_parkings_map(park[1], park[2], park[0], park[3]);

    }
    this.shit_error = true;
  }
  Refresh() {
    document.getElementById("map").innerHTML = "";
    document.getElementsByClassName("list")[0].innerHTML = "";
    this.array_markers = [];

    this.getAPI();
  }

  llistar_parkings() {

    var llista = document.getElementsByClassName("list")[0];

    for (let i = 0; i < this.Num_total_parkings; i++) {

      llista.innerHTML += "<ion-item id='" + i + "'> <ion-label>  <ion-button expand='full' id='" + i + "'>" + this.Parking[i].Name + "</ion-button> </ion-label> </ion-item>               ";
      //es filtra els valors
      this.filters(i);
    }
    const llista_buttons = document.querySelectorAll(".list ion-button");
    llista_buttons.forEach((l) => {
      l.addEventListener("click", (e: any) => {
        console.log(e.target.id);
        this.mark_desde_list = true;
        this.mark_parking_list(e.target.id);
      });
    });

  }
  mark_parking_list(target_id) {

    if (this.mark_desde_list == true) {
      this.map.setZoom(16);
      this.map.setCenter(this.array_markers[target_id].getPosition());
    } else {
    }
    if (this.parking_selected == true) {
      var x = localStorage.getItem("ultim_selected");
      const list = document.getElementsByTagName("ion-button")[x];
      list.removeAttribute("color", "success");
    } else {
    }
    //focus nom de la llista
    //document.getElementById(target_id).focus();
    this.parking_selected = true;
    localStorage.setItem("ultim_selected", target_id);
    const list = document.getElementsByTagName("ion-button")[target_id];
    list.setAttribute("color", "success");

    this.show_parking_details(target_id);
  }

  mark_parkings_map(latitude, longuitude, name, num_array) {
    // console.log(name + " = " + num_array);
    var marker = new google.maps.Marker({
      position: { lat: latitude, lng: longuitude },
      map: this.map,
      title: name,
      num_array: num_array,
      /*         icon: {                             
                  url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"                           }*/

    });
    //if (this.shit_error == true) {
    if (this.repeat_lengh == false) {
      this.array_markers.push(marker);
    }
    // } else {
    //      console.log("shit");
    //  }
    google.maps.event.addListener(marker, 'click', () => {

      this.map.setZoom(16);
      this.map.setCenter(marker.getPosition());

      /* Aquest if comprova si s'ha seleccionat anteriorment un parking  */
      if (this.parking_selected == true) {
        var x = localStorage.getItem("ultim_selected");
        //borro style anterior

        const list = document.getElementsByTagName("ion-button")[x];
        list.removeAttribute("color", "success");
      }
      //console.log(marker.title + " =" + marker.num_array);

      this.mark_parking_list(marker.num_array);
      //info_window(marker);
    });
  }

  filters(num_array) {
    var precio = this.Parking[num_array].ParkingPriceList;

    var handicap_access = this.Parking[num_array].HandicapAccess;
    var wc = this.Parking[num_array].WC;
    var elec_charger = this.Parking[num_array].ElectricCharger;
    var consigna = this.Parking[num_array].Consigna;
    var carsharing = this.Parking[num_array].Carsharing;
    var agilPark = this.Parking[num_array].appAgilpark;

    var precio_min = this.lastEmittedValueLower;
    var precio_max = this.lastEmittedValueUpper;
    if (this.array_markers.length > num_array) {
/*       if (this.vehiculo == "coche") {
        if (precio == null) {
          console.log("null");
        } else {
          console.log(precio.Price.length);
          if (precio.Price.length > 0) {
            if (precio.Price[1].Amount >= precio_min && precio.Price[1].Amount <= precio_max) {

            } else {
              console.log("borrat")
              document.getElementById(num_array).style.display = "none";
              this.array_markers[num_array].setMap(null);
            }
          }

        }
      } else if (this.vehiculo == "moto") {
        /*  if (precio == null) {
           console.log("null");
         } else {
           console.log(precio.Price.length);
           if (precio.Price.length > 0) {
             if (precio.Price[0].Amount >= precio_min && precio.Price[0].Amount <= precio_max) {
 
             } else {
               console.log("borrat")
               document.getElementById(num_array).style.display = "none";
               this.array_markers[num_array].setMap(null);
             }
           }
         } 
      } */

      if (this.filter_wc == true) {
        if (wc < 1) {
          document.getElementById(num_array).style.display = "none";
          this.array_markers[num_array].setMap(null);
        }
      }
      if (this.filter_carsharing == true) {
        if (carsharing < 1) {
          document.getElementById(num_array).style.display = "none";
          this.array_markers[num_array].setMap(null);

        }
      }
      if (this.filter_handicap_access == true) {
        if (handicap_access < 1) {
          document.getElementById(num_array).style.display = "none";
          this.array_markers[num_array].setMap(null);
        }
      }
      if (this.filter_elec_charger == true) {
        if (elec_charger < 1) {
          document.getElementById(num_array).style.display = "none";
          this.array_markers[num_array].setMap(null);
        }
      }
      if (this.filter_consigna == true) {
        if (consigna < 1) {
          document.getElementById(num_array).style.display = "none";
          this.array_markers[num_array].setMap(null);
        }
      }
      if (this.filter_agilPark == true) {
        if (agilPark < 1) {
          document.getElementById(num_array).style.display = "none";
          this.array_markers[num_array].setMap(null);
        }
      }
    }
  }

  show_parking_details(num_array) {
    var adress: string;
    var titol = this.Parking[num_array].Name;
    adress = this.Parking[num_array].Address;
    var precio = this.Parking[num_array].ParkingPriceList;
    var handicap_access = this.Parking[num_array].HandicapAccess;
    var wc = this.Parking[num_array].WC;
    var elec_charger = this.Parking[num_array].ElectricCharger;
    var consigna = this.Parking[num_array].Consigna;
    var carsharing = this.Parking[num_array].Carsharing;
    var agilPark = this.Parking[num_array].appAgilpark;
    var link_google = "https://www.google.com/maps/place/";
    //titol
    this.titol = "Nombre: " + titol;
    //adress
    document.getElementById("adress").innerHTML = '<ion-icon name="location-sharp"></ion-icon>' + " Dirección: " + adress;
    //precio
    //es comprova que els preus estiguin o si hi ha array
    if (precio == null) {
      document.getElementById("price").innerHTML = "Precio no dispible";
    } else {
      console.log(precio.Price.length);
      if (precio.Price.length > 0) {

        document.getElementById("price").innerHTML = '<i class="fa-solid fa-hand-holding-dollar"></i>' + " Precio/" + precio.Price[0].Minutes + "min: <strong>" + precio.Price[0].Amount + "€</strong> " + '<i class="fa-solid fa-person-biking"></i><br>';
        document.getElementById("price").innerHTML += '<i class="fa-solid fa-hand-holding-dollar"></i>' + " Precio/" + precio.Price[1].Minutes + "min: <strong>" + precio.Price[1].Amount + "€</strong> " + '<i class="fa-solid fa-car"></i>';

      } else {
        document.getElementById("price").innerHTML = '<i class="fa-solid fa-hand-holding-dollar"></i>' + " Precio/" + precio.Price.Minutes + "min: <strong>" + precio.Price.Amount + "€</strong> (moto)";
      }
    }
    //handicap
    if (handicap_access > 0) {
      document.getElementById("handicap").innerHTML = '<i class="fa-solid fa-wheelchair"></i>' + " Accesos para discapacitados: Si";
    } else if (handicap_access == 0) {
      document.getElementById("handicap").innerHTML = '<i class="fa-solid fa-wheelchair"></i>' + " Accesos para discapacitados: No";
    } else {
    }
    //WC
    if (wc > 0) {
      document.getElementById("wc").innerHTML = '<i class="fas fa-restroom"></i> WC: Si';

    } else {
      document.getElementById("wc").innerHTML = '<i class="fas fa-restroom"></i> WC: No';
    }
    //electric charger
    if (elec_charger > 0) {
      document.getElementById("carcharge").innerHTML = '<i class="fa-solid fa-charging-station"></i> Cargador electrico: Si';

    } else {
      document.getElementById("carcharge").innerHTML = '<i class="fa-solid fa-charging-station"></i> Cargador electrico: No';
    }
    //consigna
    if (consigna > 0) {
      document.getElementById("consigna").innerHTML = '<i class="fa-solid fa-font-awesome"></i> Consigna: Si';
    } else {
      document.getElementById("consigna").innerHTML = '<i class="fa-solid fa-font-awesome"></i> Consigna: No';
    }
    //carsharing
    if (carsharing > 0) {
      document.getElementById("carsharing").innerHTML = '<i class="fas fa-car"></i> CarSharing: Si';
    } else {
      document.getElementById("carsharing").innerHTML = '<i class="fas fa-car"></i> CarSharing: No';
    }
    //app agilpark
    if (agilPark > 0) {
      document.getElementById("agilPark").innerHTML = '<i class="fa-solid fa-mobile-screen"></i> App AgilPark: Si';
    } else {
      document.getElementById("agilPark").innerHTML = '<i class="fa-solid fa-mobile-screen"></i> App AgilPark: No';

    }

    document.getElementById("link_google").innerHTML = "<a target='_blank' href='" + link_google + adress.replace("C/", "Carrer ") + ",barcelona" + "'>Google Maps</a>";
  }
  //Loading
  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
      duration: 3000,
      spinner: 'circles'
    });

    loading.present();
  }
  openCustom() {
    this.menu.enable(true, 'custom');
    this.menu.open('custom');
  }
  onIonChange(ev: Event) {
    this.lastEmittedValueLower = (ev as RangeCustomEvent).detail.value;
    this.lastEmittedValueLower = this.lastEmittedValueLower.lower;
    this.lastEmittedValueUpper = (ev as RangeCustomEvent).detail.value;
    this.lastEmittedValueUpper = this.lastEmittedValueUpper.upper;

  }
}