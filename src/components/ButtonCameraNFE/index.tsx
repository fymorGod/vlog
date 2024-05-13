import React from "react";
import { TouchableOpacity, StyleSheet, Text, TouchableOpacityProps } from "react-native";
import { Entypo } from "@expo/vector-icons";

interface Props extends TouchableOpacityProps {
    title: string;
    icon: React.ComponentProps<typeof Entypo>['name'];
}

export function ButtonCamera({ title, icon, ...rest }: Props) {
    return (
        <TouchableOpacity style={[styles.container, rest.disabled && styles.disabledContainer]} {...rest}>
            <Entypo name={icon} size={28} color='#170E49' />
            <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '80%',
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        borderRadius: 10,
        margin: 0,
        borderColor: '#170E49',
        borderWidth: 2,
        opacity: 1,
    },
    disabledContainer: {
        opacity: 0.6,
    },
    title: {
        fontSize: 16,
        color: '#170E49',
        fontWeight: 'bold',
        marginLeft: 10,
    },
});
