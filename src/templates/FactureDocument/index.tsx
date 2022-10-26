import React, { FC } from "react";
import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";
import Order from "../../Model/Order";
import OrderProduct from "../../Model/OrderProduct";
import { formatCurrency, formatDate } from "../../utils/function";

import DefaultImage from '../../assets/img/default-product.png'

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection:'column',
    fontSize: 13
  },
  header: {
    padding: 8,
    display: 'flex',
    justifyContent : 'space-between',
    flexDirection: 'row',
  },
  image : {
    width : 130,
    height : 130,
    backgroundColor: "#E4E4E4",
  },
  right : {
    width: '80%',
    // backgroundColor : 'green',
    height : 130,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    textAlign: 'center'
  },
  rightBottom : {
    marginBottom: 10,
    textAlign: 'center',
    padding: 5
  },
  head : {
    // backgroundColor: 'yellow',
    width: '100%',
    display: 'flex',
    padding: 8
  },
  content : {
    maxWidth: 200,
    width: '100%',
    alignSelf: 'flex-end',
    marginLeft: 'auto',
    // backgroundColor: 'pink'
  },
  date : {
    width: '100%'
  },
  customer : {
    width: '100%',
    maxWidth: 200,
    // backgroundColor : 'red',
    minHeight: 50,
    border: 1,
    marginTop: 5
  },
  tableTile : {
    width: '100%',
    maxWidth: 200,
    // backgroundColor: 'violet',
    minHeight: 15,
    marginTop: 4
  },
  tableTh:{
    fontWeight: 'semibold',
    width: '25%',
    padding: 4,
    borderLeft:1,
    borderBottom: 1,
    borderTop: 1,
    minHeight: 30
  },
  tableChild:{
    width: '25%',
    padding: 4,
    borderLeft:1,
    borderBottom: 1,
    minHeight: 30
  },
  tableTotalLabel: {
    width: '75%',
    padding: 4,
    paddingRight: 8,
    minHeight: 30,
    borderBottom: 1,
    borderRight: 1,
    transform: 'translateX(1px)'
  },
  tableTotal: {
    width: '25%',
    padding: 4,
    minHeight: 30,
    borderBottom: 1
  },
  table : {
    display:'flex',
    flexWrap: 'wrap',
    width: '100%',
    flexDirection: 'row'
  },
  signature : {
    paddingTop: 8,
    paddingRight: 30,
    width: '100%',
    minHeight: 20,
    marginTop: 70,
    display: 'flex',
    textDecoration: 'underline'
  }
});

type TypeDocument = {
  className ?:  string,
  order ?: Order,
  orderProducts ?: OrderProduct[]
};

const API_STORAGE_URL = "http://localhost:8000/storage";

const FactureDocument: FC<TypeDocument> = ({
  className='',
  order = {},
  orderProducts = []
}) => {
  return (
    <Document>
      <Page wrap size="A4" style={styles.page}>

        <View style={styles.header}>
          <View style={styles.image}>
            <Image src={DefaultImage} />
          </View>
          <View style={styles.right}>
            <View style={styles.rightBottom}><Text style={{ padding:4, marginLeft: 5 }}>COMPANY Name</Text></View>
            <View style={styles.rightBottom}><Text style={{ padding:4, marginLeft: 5 }}>Commerce Général - Prestations de Services</Text></View>
            <View style={styles.rightBottom}><Text style={{ padding:4, marginLeft: 5 }}>B.P : 7754 Douala Tél : (237) 243 043 918 / 696 975 548</Text></View>
            {/* <View style={styles.rightBottom}><Text>Site internet : https://solumat-sarl.com/</Text></View> */}
          </View>
        </View>

        <View style={styles.head}>
          <View style={styles.content}>
            <Text style={styles.date}>Douala {formatDate(order.created_at || '')}</Text>
            <View style={styles.customer}>
              <Text>{order.customer?.firstname} {order.customer?.lastname}</Text>
              <Text>Email : {order.customer?.email}</Text>
              <Text>Tél : {order.customer?.tel}</Text>
            </View>
          </View>
        </View>

        <View style={styles.tableTile}><Text style={{ padding: 5 }}>FACTURE N°2/10/2022/company_name</Text></View>
        <View style={styles.table}>
          <View style={styles.tableTh}><Text>Nom du produit</Text></View>
          <View style={styles.tableTh}><Text>Quantité</Text></View>
          <View style={styles.tableTh}><Text>Prix unitaire</Text></View>
          <View style={styles.tableTh}><Text>total</Text></View>

          {orderProducts.map(item => (
            <React.Fragment key={item.id}>
              <View style={styles.tableChild}><Text>{item.product?.name}</Text></View>
              <View style={styles.tableChild}><Text>{item.qte}</Text></View>
              <View style={styles.tableChild}>
                <Text>
                  {(item.prix_de_vente || '0').toString() !== (item.product?.prix_unitaire || '0').toString() ? <>
                    {item.prix_de_vente}
                  </>:<>
                    {item.product?.prix_unitaire}
                  </>}
                </Text>
              </View>
              <View style={styles.tableChild}>
                <Text>
                  {(item.prix_de_vente || '0').toString() !== (item.product?.prix_unitaire || '0').toString() ? <>
                    {(parseInt(item.prix_de_vente?.toString() || '0',10) || 0) * (parseInt(item.qte?.toString() || '0',10)||0)}
                  </>:<>
                    {(parseInt(item.product?.prix_unitaire?.toString() || '0',10) || 0) * (parseInt(item.qte?.toString() || '0',10)||0)}
                  </>}
                </Text>
              </View>
            </React.Fragment>
          ))}
          

          <View style={styles.tableTotalLabel}><Text style={{ textAlign:'right' }}>Montant Total</Text></View>
          <View style={styles.tableTotal}><Text>{formatCurrency(parseInt(order.cout || '0',10) || 0,'XAF')}</Text></View>
        </View>

        <View style={styles.signature}><Text style={{ textAlign:'right' }}>La Direction</Text></View>

      </Page>
    </Document>
  );
};

export default FactureDocument;
