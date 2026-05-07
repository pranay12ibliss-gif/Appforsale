// components/CrossPlatformAlert.js
// ─────────────────────────────────────────────────────────────
// Drop-in replacement for Alert.alert that works on Web + Mobile
// Usage:
//   import { showAlert } from '../components/CrossPlatformAlert';
//   showAlert('Title', 'Message', [{ text: 'OK', onPress: () => {} }]);
//
// Also export <AlertProvider /> — wrap your root App with it.
// ─────────────────────────────────────────────────────────────

import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View, Text, Pressable, StyleSheet, Animated,
  Platform, Modal, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// ── Global emitter (no lib needed) ───────────────────────────
let _showFn = null;
export function showAlert(title, message, buttons, options) {
  if (Platform.OS !== 'web') {
    // Native: use built-in Alert
    const { Alert } = require('react-native');
    Alert.alert(title, message, buttons, options);
    return;
  }
  if (_showFn) _showFn({ title, message, buttons: buttons || [{ text: 'OK' }] });
}

// ── Provider ─────────────────────────────────────────────────
export function AlertProvider({ children }) {
  const [visible,  setVisible]  = useState(false);
  const [config,   setConfig]   = useState({ title: '', message: '', buttons: [] });

  const backdropOp = useRef(new Animated.Value(0)).current;
  const cardScale  = useRef(new Animated.Value(0.88)).current;
  const cardOp     = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    _showFn = (cfg) => {
      setConfig(cfg);
      setVisible(true);
    };
    return () => { _showFn = null; };
  }, []);

  useEffect(() => {
    if (visible) {
      backdropOp.setValue(0);
      cardScale.setValue(0.88);
      cardOp.setValue(0);
      Animated.parallel([
        Animated.timing(backdropOp, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.spring(cardScale,  { toValue: 1, friction: 7, tension: 90, useNativeDriver: true }),
        Animated.timing(cardOp,     { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const dismiss = useCallback((btn) => {
    Animated.parallel([
      Animated.timing(backdropOp, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(cardOp,     { toValue: 0, duration: 160, useNativeDriver: true }),
      Animated.timing(cardScale,  { toValue: 0.92, duration: 160, useNativeDriver: true }),
    ]).start(() => {
      setVisible(false);
      if (btn?.onPress) btn.onPress();
    });
  }, []);

  if (!visible) return <>{children}</>;

  return (
    <>
      {children}
      <Modal transparent animationType="none" visible={visible} onRequestClose={() => dismiss()}>
        <Animated.View style={[sty.backdrop, { opacity: backdropOp }]}>
          <Animated.View style={{ opacity: cardOp, transform: [{ scale: cardScale }], width: '100%', maxWidth: 360, marginHorizontal: 24 }}>
            <LinearGradient
              colors={['rgba(255,255,255,0.11)', 'rgba(255,255,255,0.04)']}
              style={sty.card}
            >
              {/* Shine line */}
              <View style={sty.shine} />

              {/* Icon strip */}
              <View style={sty.iconRow}>
                <LinearGradient colors={['#A855F7','#7E22CE']} style={sty.iconWrap}>
                  <Text style={sty.iconText}>!</Text>
                </LinearGradient>
              </View>

              <Text style={sty.title}>{config.title}</Text>
              {!!config.message && (
                <Text style={sty.message}>{config.message}</Text>
              )}

              <View style={sty.divider} />

              <View style={[sty.btnRow, config.buttons.length === 1 && { justifyContent: 'center' }]}>
                {config.buttons.map((btn, i) => {
                  const isDestructive = btn.style === 'destructive';
                  const isCancel      = btn.style === 'cancel';
                  const isPrimary     = !isDestructive && !isCancel && i === config.buttons.length - 1;

                  if (isPrimary) {
                    return (
                      <Pressable key={i} onPress={() => dismiss(btn)} style={{ flex: 1 }}>
                        <LinearGradient
                          colors={['#67E6E8','#42DDE2','#1FCFD6']}
                          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                          style={sty.primaryBtn}
                        >
                          <View style={sty.primaryShine} />
                          <Text style={sty.primaryTxt}>{btn.text}</Text>
                        </LinearGradient>
                      </Pressable>
                    );
                  }
                  if (isDestructive) {
                    return (
                      <Pressable
                        key={i}
                        onPress={() => dismiss(btn)}
                        style={({ pressed }) => [sty.destructBtn, pressed && { opacity: 0.75 }]}
                      >
                        <Text style={sty.destructTxt}>{btn.text}</Text>
                      </Pressable>
                    );
                  }
                  // cancel / default secondary
                  return (
                    <Pressable
                      key={i}
                      onPress={() => dismiss(btn)}
                      style={({ pressed }) => [sty.cancelBtn, pressed && { opacity: 0.75 }]}
                    >
                      <Text style={sty.cancelTxt}>{btn.text}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </LinearGradient>
          </Animated.View>
        </Animated.View>
      </Modal>
    </>
  );
}

const sty = StyleSheet.create({
  backdrop:    { flex: 1, backgroundColor: 'rgba(8,12,20,0.72)', alignItems: 'center', justifyContent: 'center' },
  card:        { borderRadius: 26, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', paddingHorizontal: 22, paddingTop: 24, paddingBottom: 20, overflow: 'hidden' },
  shine:       { position: 'absolute', top: 0, left: '15%', right: '15%', height: 1, backgroundColor: 'rgba(255,255,255,0.18)' },
  iconRow:     { alignItems: 'center', marginBottom: 14 },
  iconWrap:    { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  iconText:    { color: '#fff', fontSize: 22, fontWeight: '900' },
  title:       { color: '#FFFFFF', fontSize: 18, fontWeight: '800', textAlign: 'center', marginBottom: 8, letterSpacing: -0.2 },
  message:     { color: 'rgba(255,255,255,0.60)', fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 4 },
  divider:     { height: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginVertical: 16 },
  btnRow:      { flexDirection: 'row', gap: 10 },
  primaryBtn:  { flex: 1, minHeight: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  primaryShine:{ position: 'absolute', top: 0, left: 8, right: 8, height: 1, backgroundColor: 'rgba(255,255,255,0.35)' },
  primaryTxt:  { color: '#0A2A2B', fontSize: 14, fontWeight: '800' },
  destructBtn: { flex: 1, minHeight: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,77,106,0.14)', borderWidth: 1, borderColor: 'rgba(255,77,106,0.32)' },
  destructTxt: { color: '#FF4D6A', fontSize: 14, fontWeight: '800' },
  cancelBtn:   { flex: 1, minHeight: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.07)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  cancelTxt:   { color: 'rgba(255,255,255,0.75)', fontSize: 14, fontWeight: '700' },
});