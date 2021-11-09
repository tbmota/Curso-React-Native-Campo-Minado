import React from 'react'
import { View, StyleSheet } from 'react-native'
import Field from './Field'

export default props => {
    const rows = props.board.map((row, r) => { //elemento = row, índice = r
        const columns = row.map((field, c) => {
            return <Field {...field} key={c} // ...field objeto que representa os dados de um campo 
            // a chave é pro react mexer no componente exato, identificar de forma mais única os componentes
            //columns armazena todos os fields de uma linha
            onOpen={() => props.onOpenField(r, c)}
            onSelect={e => props.onSelectField(r, c)}/>
        })
        return <View key={r} 
            style={{ flexDirection: 'row'}}>{columns}</View>
    }) 
    return <View style={styles.container}>{rows}</View> //representa cada uma das linas do tabuleiro 
 } //estou transformando uma matriz que dentro tem objetos que mapeiam os objetos de field pra uma matriz que tem elementos JSX

 const styles = StyleSheet.create({
     container: {
         backgroundColor: '#EEE',
     }
 })