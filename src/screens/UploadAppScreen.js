
// import React, { useState } from 'react';
// import {
//   Alert, KeyboardAvoidingView, Platform, Pressable,
//   SafeAreaView, ScrollView, StatusBar, StyleSheet,
//   Text, TextInput, View, Image, FlatList,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import * as ImagePicker from 'expo-image-picker';
// import { uploadAppApi } from '../utils/apiService';
// import { COLORS } from '../theme';
// import { useMarketplace } from '../context/MarketplaceContext';
// import { useNotifications } from '../context/NotificationContext';

// const CATEGORIES = ['E-commerce', 'Management', 'Commerce', 'Business'];

// const initialForm = {
//   title: '', description: '', category: '', price: '',
//   ownerName: '', ownerEmail: '', ownerPhone: '',
//   company: '', features: '', images: [],
// };

// const initialErrors = {
//   title: '', description: '', category: '', price: '',
//   ownerName: '', ownerEmail: '', ownerPhone: '',
//   company: '', features: '', images: '',
// };

// function Field({ label, value, onChangeText, placeholder, multiline = false,
//   keyboardType = 'default', autoCapitalize = 'sentences', error = '', maxLength }) {
//   return (
//     <View style={styles.fieldWrap}>
//       <Text style={styles.label}>{label}</Text>
//       <TextInput
//         value={value}
//         onChangeText={onChangeText}
//         placeholder={placeholder}
//         placeholderTextColor="#7F8794"
//         multiline={multiline}
//         keyboardType={keyboardType}
//         autoCapitalize={autoCapitalize}
//         maxLength={maxLength}
//         style={[styles.input, multiline && styles.inputMultiline, error ? styles.inputError : null]}
//       />
//       {error ? <Text style={styles.errorText}>⚠ {error}</Text> : null}
//     </View>
//   );
// }

// export default function UploadAppScreen({ navigation }) {
//   const { addApp } = useMarketplace();
//   const { addNotification } = useNotifications();

//   const [form, setForm] = useState(initialForm);
//   const [errors, setErrors] = useState(initialErrors);
//   const [pickingImage, setPickingImage] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const updateField = (key, value) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//     setErrors((prev) => ({ ...prev, [key]: '' }));
//   };

//   const pickImageFromGallery = async () => {
//     try {
//       setPickingImage(true);
//       const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (!permissionResult.granted) {
//         Alert.alert('Permission Required', 'Please allow photo library access.');
//         return;
//       }
//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsMultipleSelection: true,
//         quality: 0.8,
//       });
//       if (!result.canceled && result.assets?.length > 0) {
//         const newImages = result.assets.map(img => ({ uri: img.uri }));
//         setForm(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
//         setErrors(prev => ({ ...prev, images: '' }));
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Unable to select images.');
//     } finally {
//       setPickingImage(false);
//     }
//   };

//   const removeImage = (index) => {
//     const updated = form.images.filter((_, i) => i !== index);
//     updateField('images', updated);
//   };

//   const validate = () => {
//     const newErrors = { ...initialErrors };
//     let valid = true;

//     if (!form.title.trim())        { newErrors.title = 'App title is required'; valid = false; }
//     if (!form.category)            { newErrors.category = 'Please select a category'; valid = false; }
//     if (!form.description.trim())  { newErrors.description = 'Description is required'; valid = false; }
//     if (!form.price.trim()) {
//       newErrors.price = 'Price is required'; valid = false;
//     } else if (isNaN(Number(form.price)) || Number(form.price) < 0) {
//       newErrors.price = 'Price must be a valid positive number'; valid = false;
//     }
//     if (!form.ownerName.trim())    { newErrors.ownerName = 'Owner name is required'; valid = false; }
//     if (!form.ownerEmail.trim()) {
//       newErrors.ownerEmail = 'Owner email is required'; valid = false;
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.ownerEmail.trim())) {
//       newErrors.ownerEmail = 'Enter a valid email'; valid = false;
//     }
//     if (!form.ownerPhone.trim()) {
//       newErrors.ownerPhone = 'Phone number is required'; valid = false;
//     } else if (!/^[0-9]{10}$/.test(form.ownerPhone.trim())) {
//       newErrors.ownerPhone = 'Phone must be exactly 10 digits'; valid = false;
//     }
//     if (form.images.length === 0) {
//       newErrors.images = 'Upload at least one image'; valid = false;
//     }

//     setErrors(newErrors);
//     return valid;
//   };

//   const handleSubmit = async () => {
//     if (!validate()) {
//       Alert.alert('Validation Error', 'Please fix the errors before submitting.');
//       return;
//     }
//     try {
//       setLoading(true);
//       await uploadAppApi(form);
//       addNotification(
//         `New App Submitted: ${form.title}`,
//         `"${form.title}" has been sent for admin approval.`,
//         'info'
//       );
//       Alert.alert(
//         '✅ Submitted',
//         'App sent to admin for approval. It will be visible after approval.',
//         [{ text: 'Go to Home', onPress: () => navigation.navigate('Home') }]
//       );
//     } catch (error) {
//       Alert.alert('Error', error.message || 'Upload failed. Try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
//       <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
//         <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
//           <Text style={styles.eyebrow}>UPLOAD APP</Text>
//           <Text style={styles.title}>Submit Your App</Text>
//           <Text style={styles.subtitle}>Fill in the details below. Submitted apps appear after approval.</Text>

//           <View style={styles.card}>

//             {/* ── Image Section ── */}
//             <Text style={styles.sectionTitle}>App Images</Text>
//             <Text style={styles.sectionSubtitle}>Upload 2–5 images. First image will be the cover.</Text>

//             {/* Image Carousel Preview */}
//             {form.images.length > 0 ? (
//               <ScrollView
//                 horizontal
//                 showsHorizontalScrollIndicator={false}
//                 style={styles.imageCarousel}
//                 contentContainerStyle={styles.imageCarouselContent}
//               >
//                 {form.images.map((img, index) => (
//                   <View key={index} style={styles.imageThumbWrap}>
//                     <Image source={img} style={styles.imageThumb} resizeMode="cover" />
//                     {index === 0 && (
//                       <View style={styles.coverBadge}>
//                         <Text style={styles.coverBadgeText}>Cover</Text>
//                       </View>
//                     )}
//                     <Pressable
//                       onPress={() => removeImage(index)}
//                       style={styles.removeImageBtn}
//                     >
//                       <Text style={styles.removeImageBtnText}>✕</Text>
//                     </Pressable>
//                   </View>
//                 ))}

//                 {/* Add more button inside carousel */}
//                 {form.images.length < 5 && (
//                   <Pressable
//                     onPress={pickImageFromGallery}
//                     style={({ pressed }) => [styles.addMoreThumb, pressed && styles.pressed]}
//                   >
//                     <Text style={styles.addMoreIcon}>+</Text>
//                     <Text style={styles.addMoreText}>Add</Text>
//                   </Pressable>
//                 )}
//               </ScrollView>
//             ) : (
//               // Empty state picker
//               <Pressable
//                 onPress={pickImageFromGallery}
//                 style={({ pressed }) => [
//                   styles.emptyImagePicker,
//                   errors.images ? styles.imagePickerError : null,
//                   pressed && styles.pressed,
//                 ]}
//               >
//                 <Text style={styles.uploadPlaceholderIcon}>↑</Text>
//                 <Text style={styles.uploadPlaceholderTitle}>Upload App Images</Text>
//                 <Text style={styles.uploadPlaceholderText}>Tap to select 2–5 images from gallery</Text>
//               </Pressable>
//             )}

//             {errors.images ? <Text style={styles.errorText}>⚠ {errors.images}</Text> : null}

//             <View style={styles.imageActionsRow}>
//               <Pressable
//                 onPress={pickImageFromGallery}
//                 disabled={form.images.length >= 5}
//                 style={({ pressed }) => [
//                   styles.secondaryActionBtn,
//                   form.images.length >= 5 && styles.disabledBtn,
//                   pressed && styles.pressed,
//                 ]}
//               >
//                 <Text style={[
//                   styles.secondaryActionBtnText,
//                   form.images.length >= 5 && styles.disabledBtnText,
//                 ]}>
//                   {pickingImage
//                     ? 'Opening...'
//                     : form.images.length >= 5
//                     ? 'Max 5 images'
//                     : form.images.length > 0
//                     ? `Add More (${form.images.length}/5)`
//                     : 'Choose Images'}
//                 </Text>
//               </Pressable>

//               {form.images.length > 0 && (
//                 <Pressable
//                   onPress={() => updateField('images', [])}
//                   style={({ pressed }) => [styles.removeActionBtn, pressed && styles.pressed]}
//                 >
//                   <Text style={styles.removeActionBtnText}>Clear All</Text>
//                 </Pressable>
//               )}
//             </View>

//             {/* Image count indicator */}
//             {form.images.length > 0 && (
//               <View style={styles.imageCountRow}>
//                 {form.images.map((_, i) => (
//                   <View
//                     key={i}
//                     style={[styles.imageCountDot, i === 0 && styles.imageCountDotActive]}
//                   />
//                 ))}
//                 <Text style={styles.imageCountText}>{form.images.length} image{form.images.length !== 1 ? 's' : ''} selected</Text>
//               </View>
//             )}

//             {/* ── Form Fields ── */}
//             <Field label="App Title *" value={form.title}
//               onChangeText={(t) => updateField('title', t)}
//               placeholder="Enter app title" error={errors.title} />

//             <View style={styles.fieldWrap}>
//               <Text style={styles.label}>Category *</Text>
//               <View style={styles.categoryRow}>
//                 {CATEGORIES.map((cat) => (
//                   <Pressable
//                     key={cat}
//                     onPress={() => updateField('category', cat)}
//                     style={({ pressed }) => [
//                       styles.categoryChip,
//                       form.category === cat && styles.categoryChipActive,
//                       pressed && styles.pressed,
//                     ]}
//                   >
//                     <Text style={[styles.categoryChipText, form.category === cat && styles.categoryChipTextActive]}>
//                       {cat}
//                     </Text>
//                   </Pressable>
//                 ))}
//               </View>
//               {errors.category ? <Text style={styles.errorText}>⚠ {errors.category}</Text> : null}
//             </View>

//             <Field label="Description *" value={form.description}
//               onChangeText={(t) => updateField('description', t)}
//               placeholder="Enter app description" multiline error={errors.description} />

//             <Field label="Price (₹) *" value={form.price}
//               onChangeText={(t) => updateField('price', t.replace(/[^0-9.]/g, ''))}
//               placeholder="e.g. 49999" keyboardType="numeric" error={errors.price} />

//             <Field label="Owner Name *" value={form.ownerName}
//               onChangeText={(t) => updateField('ownerName', t)}
//               placeholder="Enter owner name" error={errors.ownerName} />

//             <Field label="Owner Email *" value={form.ownerEmail}
//               onChangeText={(t) => updateField('ownerEmail', t)}
//               placeholder="owner@example.com" keyboardType="email-address"
//               autoCapitalize="none" error={errors.ownerEmail} />

//             <Field label="Owner Phone * (10 digits)" value={form.ownerPhone}
//               onChangeText={(t) => updateField('ownerPhone', t.replace(/[^0-9]/g, ''))}
//               placeholder="10-digit mobile number" keyboardType="phone-pad"
//               maxLength={10} error={errors.ownerPhone} />

//             <Field label="Company" value={form.company}
//               onChangeText={(t) => updateField('company', t)}
//               placeholder="Enter company name" error={errors.company} />

//             <Field label="Features" value={form.features}
//               onChangeText={(t) => updateField('features', t)}
//               placeholder="Enter key features" multiline error={errors.features} />

//             <Pressable style={styles.submitBtnWrap} onPress={handleSubmit} disabled={loading}>
//               <LinearGradient
//                 colors={['#67E6E8', '#42DDE2', '#1FCFD6']}
//                 start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
//                 style={styles.submitBtn}
//               >
//                 <Text style={styles.submitBtnText}>{loading ? 'Submitting...' : 'Submit App'}</Text>
//               </LinearGradient>
//             </Pressable>

//             <Pressable style={styles.cancelBtn} onPress={() => navigation.goBack()}>
//               <Text style={styles.cancelBtnText}>Cancel</Text>
//             </Pressable>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   pressed:        { opacity: 0.88 },
//   safeArea:       { flex: 1, backgroundColor: COLORS.background },
//   container:      { flexGrow: 1, paddingHorizontal: 18, paddingTop: 10, paddingBottom: 40 },
//   eyebrow:        { color: '#67E6E8', fontSize: 10, fontWeight: '700', letterSpacing: 1, marginBottom: 6 },
//   title:          { color: '#FFFFFF', fontSize: 28, fontWeight: '800', marginBottom: 8 },
//   subtitle:       { color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 20, marginBottom: 18 },
//   card:           { backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 22, padding: 16 },
//   sectionTitle:   { color: '#FFFFFF', fontSize: 15, fontWeight: '800', marginBottom: 4 },
//   sectionSubtitle:{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 14 },

//   // ── Image Carousel ──
//   imageCarousel:        { marginBottom: 8 },
//   imageCarouselContent: { paddingRight: 8 },
//   imageThumbWrap:       { width: 120, height: 100, borderRadius: 14, overflow: 'hidden', marginRight: 10, position: 'relative' },
//   imageThumb:           { width: '100%', height: '100%' },
//   coverBadge:           { position: 'absolute', top: 6, left: 6, backgroundColor: 'rgba(103,232,240,0.90)', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 },
//   coverBadgeText:       { color: '#0A2A2B', fontSize: 9, fontWeight: '800' },
//   removeImageBtn:       { position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(255,77,106,0.90)', alignItems: 'center', justifyContent: 'center' },
//   removeImageBtnText:   { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
//   addMoreThumb:         { width: 80, height: 100, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
//   addMoreIcon:          { color: '#67E6E8', fontSize: 24, fontWeight: '800', marginBottom: 4 },
//   addMoreText:          { color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: '600' },

//   // ── Empty picker ──
//   emptyImagePicker:     { height: 120, borderRadius: 18, overflow: 'hidden', marginBottom: 8, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
//   imagePickerError:     { borderColor: '#FF5252' },
//   uploadPlaceholderIcon:{ color: '#67E6E8', fontSize: 28, fontWeight: '800', marginBottom: 8 },
//   uploadPlaceholderTitle:{ color: '#FFFFFF', fontSize: 15, fontWeight: '800', marginBottom: 4 },
//   uploadPlaceholderText: { color: 'rgba(255,255,255,0.6)', fontSize: 12, textAlign: 'center' },

//   // ── Image count ──
//   imageCountRow:       { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16, marginTop: 4 },
//   imageCountDot:       { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.25)' },
//   imageCountDotActive: { backgroundColor: '#67E6E8', width: 14 },
//   imageCountText:      { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '600', marginLeft: 4 },

//   imageActionsRow:       { flexDirection: 'row', gap: 10, marginBottom: 8 },
//   secondaryActionBtn:    { flex: 1, minHeight: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
//   secondaryActionBtnText:{ color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
//   disabledBtn:           { opacity: 0.4 },
//   disabledBtnText:       { color: 'rgba(255,255,255,0.4)' },
//   removeActionBtn:       { minWidth: 92, minHeight: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,80,80,0.10)', borderWidth: 1, borderColor: 'rgba(255,80,80,0.24)', paddingHorizontal: 14 },
//   removeActionBtnText:   { color: '#FF5252', fontSize: 13, fontWeight: '700' },

//   categoryRow:          { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 4 },
//   categoryChip:         { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)' },
//   categoryChipActive:   { backgroundColor: 'rgba(103,232,240,0.16)', borderColor: 'rgba(66,221,226,0.40)' },
//   categoryChipText:     { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '600' },
//   categoryChipTextActive:{ color: '#67E6E8', fontWeight: '800' },

//   fieldWrap:      { marginBottom: 14 },
//   label:          { color: '#FFFFFF', fontSize: 13, fontWeight: '700', marginBottom: 8 },
//   input:          { minHeight: 50, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.04)', paddingHorizontal: 14, color: '#FFFFFF', fontSize: 14 },
//   inputMultiline: { minHeight: 110, textAlignVertical: 'top', paddingTop: 14 },
//   inputError:     { borderColor: '#FF5252' },
//   errorText:      { color: '#FF5252', fontSize: 12, marginTop: 4, fontWeight: '600' },

//   submitBtnWrap:  { borderRadius: 16, overflow: 'hidden', marginTop: 4, marginBottom: 12, elevation: 6 },
//   submitBtn:      { minHeight: 52, alignItems: 'center', justifyContent: 'center' },
//   submitBtnText:  { color: '#12343A', fontSize: 15, fontWeight: '800' },
//   cancelBtn:      { minHeight: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
//   cancelBtnText:  { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
// });

// import React, { useState } from 'react';
// import {
//   Alert, KeyboardAvoidingView, Platform, Pressable,
//   SafeAreaView, ScrollView, StatusBar, StyleSheet,
//   Text, TextInput, View, Image,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import * as ImagePicker from 'expo-image-picker';
// import { uploadAppApi, uploadAppDirectApi } from '../utils/apiService';
// import { COLORS } from '../theme';
// import { useMarketplace } from '../context/MarketplaceContext';
// import { useNotifications } from '../context/NotificationContext';

// const CATEGORIES = ['E-commerce', 'Management', 'Commerce', 'Business'];

// const initialForm = {
//   title: '', description: '', category: '', price: '',
//   ownerName: '', ownerEmail: '', ownerPhone: '',
//   company: '', features: '', images: [],
// };

// const initialErrors = {
//   title: '', description: '', category: '', price: '',
//   ownerName: '', ownerEmail: '', ownerPhone: '',
//   company: '', features: '', images: '',
// };

// function Field({ label, value, onChangeText, placeholder, multiline = false,
//   keyboardType = 'default', autoCapitalize = 'sentences', error = '', maxLength }) {
//   return (
//     <View style={styles.fieldWrap}>
//       <Text style={styles.label}>{label}</Text>
//       <TextInput
//         value={value}
//         onChangeText={onChangeText}
//         placeholder={placeholder}
//         placeholderTextColor="#7F8794"
//         multiline={multiline}
//         keyboardType={keyboardType}
//         autoCapitalize={autoCapitalize}
//         maxLength={maxLength}
//         style={[styles.input, multiline && styles.inputMultiline, error ? styles.inputError : null]}
//       />
//       {error ? <Text style={styles.errorText}>⚠ {error}</Text> : null}
//     </View>
//   );
// }

// export default function UploadAppScreen({ navigation, route }) {
//   const { addApp, refreshApps } = useMarketplace();
//   const { addNotification }     = useNotifications();

//   // ✅ Admin check — AdminHomeScreen navigate చేసేటప్పుడు isAdmin: true pass చేయాలి
//   const isAdmin = route?.params?.isAdmin === true;

//   const [form,         setForm]         = useState(initialForm);
//   const [errors,       setErrors]       = useState(initialErrors);
//   const [pickingImage, setPickingImage] = useState(false);
//   const [loading,      setLoading]      = useState(false);

//   const updateField = (key, value) => {
//     setForm((prev) => ({ ...prev, [key]: value }));
//     setErrors((prev) => ({ ...prev, [key]: '' }));
//   };

//   const pickImageFromGallery = async () => {
//     try {
//       setPickingImage(true);
//       const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (!permissionResult.granted) {
//         Alert.alert('Permission Required', 'Please allow photo library access.');
//         return;
//       }
//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsMultipleSelection: true,
//         quality: 0.8,
//       });
//       if (!result.canceled && result.assets?.length > 0) {
//         const newImages = result.assets.map(img => ({ uri: img.uri }));
//         setForm(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
//         setErrors(prev => ({ ...prev, images: '' }));
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Unable to select images.');
//     } finally {
//       setPickingImage(false);
//     }
//   };

//   const removeImage = (index) => {
//     const updated = form.images.filter((_, i) => i !== index);
//     updateField('images', updated);
//   };

//   const validate = () => {
//     const newErrors = { ...initialErrors };
//     let valid = true;

//     if (!form.title.trim())       { newErrors.title = 'App title is required'; valid = false; }
//     if (!form.category)           { newErrors.category = 'Please select a category'; valid = false; }
//     if (!form.description.trim()) { newErrors.description = 'Description is required'; valid = false; }
//     if (!form.price.trim()) {
//       newErrors.price = 'Price is required'; valid = false;
//     } else if (isNaN(Number(form.price)) || Number(form.price) < 0) {
//       newErrors.price = 'Price must be a valid positive number'; valid = false;
//     }
//     if (!form.ownerName.trim())  { newErrors.ownerName = 'Owner name is required'; valid = false; }
//     if (!form.ownerEmail.trim()) {
//       newErrors.ownerEmail = 'Owner email is required'; valid = false;
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.ownerEmail.trim())) {
//       newErrors.ownerEmail = 'Enter a valid email'; valid = false;
//     }
//     if (!form.ownerPhone.trim()) {
//       newErrors.ownerPhone = 'Phone number is required'; valid = false;
//     } else if (!/^[0-9]{10}$/.test(form.ownerPhone.trim())) {
//       newErrors.ownerPhone = 'Phone must be exactly 10 digits'; valid = false;
//     }
//     if (form.images.length === 0) {
//       newErrors.images = 'Upload at least one image'; valid = false;
//     }

//     setErrors(newErrors);
//     return valid;
//   };

//   const handleSubmit = async () => {
//     if (!validate()) {
//       Alert.alert('Validation Error', 'Please fix the errors before submitting.');
//       return;
//     }

//     try {
//       setLoading(true);

//       if (isAdmin) {
//         // ✅ Admin upload — directly approved గా add అవుతుంది
//         await uploadAppDirectApi(form); // status: 'approved' తో save చేస్తుంది
//         await refreshApps();            // ✅ context immediately update — home lo show avutundi
//         Alert.alert(
//           '✅ Published!',
//           `"${form.title}" is now live in the marketplace.`,
//           [{ text: 'Go to Admin Home', onPress: () => navigation.navigate('AdminHome') }]
//         );
//       } else {
//         // ✅ User upload — pending గా పంపుతుంది, admin approve చేయాలి
//         await uploadAppApi(form);
//         addNotification(
//           `New App Submitted: ${form.title}`,
//           `"${form.title}" has been sent for admin approval.`,
//           'info'
//         );
//         Alert.alert(
//           '✅ Submitted',
//           'App sent to admin for approval. It will be visible after approval.',
//           [{ text: 'Go to Home', onPress: () => navigation.navigate('Home') }]
//         );
//       }
//     } catch (error) {
//       Alert.alert('Error', error.message || 'Upload failed. Try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
//       <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
//         <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>

//           {/* ✅ Admin badge — admin upload అని clearly చూపిస్తుంది */}
//           {isAdmin && (
//             <View style={styles.adminBanner}>
//               <LinearGradient
//                 colors={['rgba(168,85,247,0.18)', 'rgba(126,34,206,0.08)']}
//                 style={styles.adminBannerGradient}
//               >
//                 <Text style={styles.adminBannerIcon}>⚙</Text>
//                 <View>
//                   <Text style={styles.adminBannerTitle}>Admin Upload</Text>
//                   <Text style={styles.adminBannerText}>This app will be published directly — no approval needed.</Text>
//                 </View>
//               </LinearGradient>
//             </View>
//           )}

//           <Text style={styles.eyebrow}>{isAdmin ? 'ADMIN PUBLISH' : 'UPLOAD APP'}</Text>
//           <Text style={styles.title}>{isAdmin ? 'Publish App Directly' : 'Submit Your App'}</Text>
//           <Text style={styles.subtitle}>
//             {isAdmin
//               ? 'Fill in the details below. This app will go live immediately.'
//               : 'Fill in the details below. Submitted apps appear after approval.'}
//           </Text>

//           <View style={styles.card}>

//             {/* ── Image Section ── */}
//             <Text style={styles.sectionTitle}>App Images</Text>
//             <Text style={styles.sectionSubtitle}>Upload 2–5 images. First image will be the cover.</Text>

//             {form.images.length > 0 ? (
//               <ScrollView
//                 horizontal
//                 showsHorizontalScrollIndicator={false}
//                 style={styles.imageCarousel}
//                 contentContainerStyle={styles.imageCarouselContent}
//               >
//                 {form.images.map((img, index) => (
//                   <View key={index} style={styles.imageThumbWrap}>
//                     <Image source={img} style={styles.imageThumb} resizeMode="cover" />
//                     {index === 0 && (
//                       <View style={styles.coverBadge}>
//                         <Text style={styles.coverBadgeText}>Cover</Text>
//                       </View>
//                     )}
//                     <Pressable onPress={() => removeImage(index)} style={styles.removeImageBtn}>
//                       <Text style={styles.removeImageBtnText}>✕</Text>
//                     </Pressable>
//                   </View>
//                 ))}

//                 {form.images.length < 5 && (
//                   <Pressable
//                     onPress={pickImageFromGallery}
//                     style={({ pressed }) => [styles.addMoreThumb, pressed && styles.pressed]}
//                   >
//                     <Text style={styles.addMoreIcon}>+</Text>
//                     <Text style={styles.addMoreText}>Add</Text>
//                   </Pressable>
//                 )}
//               </ScrollView>
//             ) : (
//               <Pressable
//                 onPress={pickImageFromGallery}
//                 style={({ pressed }) => [
//                   styles.emptyImagePicker,
//                   errors.images ? styles.imagePickerError : null,
//                   pressed && styles.pressed,
//                 ]}
//               >
//                 <Text style={styles.uploadPlaceholderIcon}>↑</Text>
//                 <Text style={styles.uploadPlaceholderTitle}>Upload App Images</Text>
//                 <Text style={styles.uploadPlaceholderText}>Tap to select 2–5 images from gallery</Text>
//               </Pressable>
//             )}

//             {errors.images ? <Text style={styles.errorText}>⚠ {errors.images}</Text> : null}

//             <View style={styles.imageActionsRow}>
//               <Pressable
//                 onPress={pickImageFromGallery}
//                 disabled={form.images.length >= 5}
//                 style={({ pressed }) => [
//                   styles.secondaryActionBtn,
//                   form.images.length >= 5 && styles.disabledBtn,
//                   pressed && styles.pressed,
//                 ]}
//               >
//                 <Text style={[
//                   styles.secondaryActionBtnText,
//                   form.images.length >= 5 && styles.disabledBtnText,
//                 ]}>
//                   {pickingImage
//                     ? 'Opening...'
//                     : form.images.length >= 5
//                     ? 'Max 5 images'
//                     : form.images.length > 0
//                     ? `Add More (${form.images.length}/5)`
//                     : 'Choose Images'}
//                 </Text>
//               </Pressable>

//               {form.images.length > 0 && (
//                 <Pressable
//                   onPress={() => updateField('images', [])}
//                   style={({ pressed }) => [styles.removeActionBtn, pressed && styles.pressed]}
//                 >
//                   <Text style={styles.removeActionBtnText}>Clear All</Text>
//                 </Pressable>
//               )}
//             </View>

//             {form.images.length > 0 && (
//               <View style={styles.imageCountRow}>
//                 {form.images.map((_, i) => (
//                   <View key={i} style={[styles.imageCountDot, i === 0 && styles.imageCountDotActive]} />
//                 ))}
//                 <Text style={styles.imageCountText}>{form.images.length} image{form.images.length !== 1 ? 's' : ''} selected</Text>
//               </View>
//             )}

//             {/* ── Form Fields ── */}
//             <Field label="App Title *" value={form.title}
//               onChangeText={(t) => updateField('title', t)}
//               placeholder="Enter app title" error={errors.title} />

//             <View style={styles.fieldWrap}>
//               <Text style={styles.label}>Category *</Text>
//               <View style={styles.categoryRow}>
//                 {CATEGORIES.map((cat) => (
//                   <Pressable
//                     key={cat}
//                     onPress={() => updateField('category', cat)}
//                     style={({ pressed }) => [
//                       styles.categoryChip,
//                       form.category === cat && styles.categoryChipActive,
//                       pressed && styles.pressed,
//                     ]}
//                   >
//                     <Text style={[styles.categoryChipText, form.category === cat && styles.categoryChipTextActive]}>
//                       {cat}
//                     </Text>
//                   </Pressable>
//                 ))}
//               </View>
//               {errors.category ? <Text style={styles.errorText}>⚠ {errors.category}</Text> : null}
//             </View>

//             <Field label="Description *" value={form.description}
//               onChangeText={(t) => updateField('description', t)}
//               placeholder="Enter app description" multiline error={errors.description} />

//             <Field label="Price (₹) *" value={form.price}
//               onChangeText={(t) => updateField('price', t.replace(/[^0-9.]/g, ''))}
//               placeholder="e.g. 49999" keyboardType="numeric" error={errors.price} />

//             <Field label="Owner Name *" value={form.ownerName}
//               onChangeText={(t) => updateField('ownerName', t)}
//               placeholder="Enter owner name" error={errors.ownerName} />

//             <Field label="Owner Email *" value={form.ownerEmail}
//               onChangeText={(t) => updateField('ownerEmail', t)}
//               placeholder="owner@example.com" keyboardType="email-address"
//               autoCapitalize="none" error={errors.ownerEmail} />

//             <Field label="Owner Phone * (10 digits)" value={form.ownerPhone}
//               onChangeText={(t) => updateField('ownerPhone', t.replace(/[^0-9]/g, ''))}
//               placeholder="10-digit mobile number" keyboardType="phone-pad"
//               maxLength={10} error={errors.ownerPhone} />

//             <Field label="Company" value={form.company}
//               onChangeText={(t) => updateField('company', t)}
//               placeholder="Enter company name" error={errors.company} />

//             <Field label="Features" value={form.features}
//               onChangeText={(t) => updateField('features', t)}
//               placeholder="Enter key features" multiline error={errors.features} />

//             {/* ✅ Submit button — admin కి "Publish Now", user కి "Submit App" */}
//             <Pressable style={styles.submitBtnWrap} onPress={handleSubmit} disabled={loading}>
//               <LinearGradient
//                 colors={isAdmin ? ['#A855F7', '#7E22CE'] : ['#67E6E8', '#42DDE2', '#1FCFD6']}
//                 start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
//                 style={styles.submitBtn}
//               >
//                 <Text style={styles.submitBtnText}>
//                   {loading
//                     ? (isAdmin ? 'Publishing...' : 'Submitting...')
//                     : (isAdmin ? '⚡ Publish Now' : 'Submit App')}
//                 </Text>
//               </LinearGradient>
//             </Pressable>

//             <Pressable style={styles.cancelBtn} onPress={() => navigation.goBack()}>
//               <Text style={styles.cancelBtnText}>Cancel</Text>
//             </Pressable>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   pressed:        { opacity: 0.88 },
//   safeArea:       { flex: 1, backgroundColor: COLORS.background },
//   container:      { flexGrow: 1, paddingHorizontal: 18, paddingTop: 10, paddingBottom: 40 },

//   // ✅ Admin banner
//   adminBanner:         { marginBottom: 14 },
//   adminBannerGradient: { borderRadius: 16, borderWidth: 1, borderColor: 'rgba(168,85,247,0.28)', paddingHorizontal: 14, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
//   adminBannerIcon:     { fontSize: 22 },
//   adminBannerTitle:    { color: '#C084FC', fontSize: 13, fontWeight: '800', marginBottom: 3 },
//   adminBannerText:     { color: 'rgba(255,255,255,0.60)', fontSize: 11, lineHeight: 16 },

//   eyebrow:        { color: '#67E6E8', fontSize: 10, fontWeight: '700', letterSpacing: 1, marginBottom: 6 },
//   title:          { color: '#FFFFFF', fontSize: 28, fontWeight: '800', marginBottom: 8 },
//   subtitle:       { color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 20, marginBottom: 18 },
//   card:           { backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 22, padding: 16 },
//   sectionTitle:   { color: '#FFFFFF', fontSize: 15, fontWeight: '800', marginBottom: 4 },
//   sectionSubtitle:{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 14 },

//   imageCarousel:        { marginBottom: 8 },
//   imageCarouselContent: { paddingRight: 8 },
//   imageThumbWrap:       { width: 120, height: 100, borderRadius: 14, overflow: 'hidden', marginRight: 10, position: 'relative' },
//   imageThumb:           { width: '100%', height: '100%' },
//   coverBadge:           { position: 'absolute', top: 6, left: 6, backgroundColor: 'rgba(103,232,240,0.90)', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 3 },
//   coverBadgeText:       { color: '#0A2A2B', fontSize: 9, fontWeight: '800' },
//   removeImageBtn:       { position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(255,77,106,0.90)', alignItems: 'center', justifyContent: 'center' },
//   removeImageBtnText:   { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
//   addMoreThumb:         { width: 80, height: 100, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
//   addMoreIcon:          { color: '#67E6E8', fontSize: 24, fontWeight: '800', marginBottom: 4 },
//   addMoreText:          { color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: '600' },

//   emptyImagePicker:      { height: 120, borderRadius: 18, overflow: 'hidden', marginBottom: 8, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
//   imagePickerError:      { borderColor: '#FF5252' },
//   uploadPlaceholderIcon: { color: '#67E6E8', fontSize: 28, fontWeight: '800', marginBottom: 8 },
//   uploadPlaceholderTitle:{ color: '#FFFFFF', fontSize: 15, fontWeight: '800', marginBottom: 4 },
//   uploadPlaceholderText: { color: 'rgba(255,255,255,0.6)', fontSize: 12, textAlign: 'center' },

//   imageCountRow:       { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16, marginTop: 4 },
//   imageCountDot:       { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.25)' },
//   imageCountDotActive: { backgroundColor: '#67E6E8', width: 14 },
//   imageCountText:      { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '600', marginLeft: 4 },

//   imageActionsRow:       { flexDirection: 'row', gap: 10, marginBottom: 8 },
//   secondaryActionBtn:    { flex: 1, minHeight: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
//   secondaryActionBtnText:{ color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
//   disabledBtn:           { opacity: 0.4 },
//   disabledBtnText:       { color: 'rgba(255,255,255,0.4)' },
//   removeActionBtn:       { minWidth: 92, minHeight: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,80,80,0.10)', borderWidth: 1, borderColor: 'rgba(255,80,80,0.24)', paddingHorizontal: 14 },
//   removeActionBtnText:   { color: '#FF5252', fontSize: 13, fontWeight: '700' },

//   categoryRow:           { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 4 },
//   categoryChip:          { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)' },
//   categoryChipActive:    { backgroundColor: 'rgba(103,232,240,0.16)', borderColor: 'rgba(66,221,226,0.40)' },
//   categoryChipText:      { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '600' },
//   categoryChipTextActive:{ color: '#67E6E8', fontWeight: '800' },

//   fieldWrap:      { marginBottom: 14 },
//   label:          { color: '#FFFFFF', fontSize: 13, fontWeight: '700', marginBottom: 8 },
//   input:          { minHeight: 50, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.04)', paddingHorizontal: 14, color: '#FFFFFF', fontSize: 14 },
//   inputMultiline: { minHeight: 110, textAlignVertical: 'top', paddingTop: 14 },
//   inputError:     { borderColor: '#FF5252' },
//   errorText:      { color: '#FF5252', fontSize: 12, marginTop: 4, fontWeight: '600' },

//   submitBtnWrap:  { borderRadius: 16, overflow: 'hidden', marginTop: 4, marginBottom: 12, elevation: 6 },
//   submitBtn:      { minHeight: 52, alignItems: 'center', justifyContent: 'center' },
//   submitBtnText:  { color: '#12343A', fontSize: 15, fontWeight: '800' },
//   cancelBtn:      { minHeight: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
//   cancelBtnText:  { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
// });

import React, { useState } from 'react';
import {
  Alert, KeyboardAvoidingView, Platform, Pressable,
  SafeAreaView, ScrollView, StatusBar, StyleSheet,
  Text, TextInput, View, Image, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { uploadAppApi, uploadAppDirectApi } from '../utils/apiService';
import { COLORS } from '../theme';
import { useMarketplace } from '../context/MarketplaceContext';
import { useNotifications } from '../context/NotificationContext';

const SCREEN_W = Dimensions.get('window').width;
const THUMB_W  = Math.floor((SCREEN_W - 36 - 32 - 10) / 2);
const THUMB_H  = THUMB_W; // square after crop

const CATEGORIES = ['E-commerce', 'Management', 'Commerce', 'Business'];

const initialForm = {
  title: '', description: '', category: '', price: '',
  ownerName: '', ownerEmail: '', ownerPhone: '',
  company: '', features: '', images: [],
};

const initialErrors = {
  title: '', description: '', category: '', price: '',
  ownerName: '', ownerEmail: '', ownerPhone: '',
  company: '', features: '', images: '',
};

function Field({ label, value, onChangeText, placeholder, multiline = false,
  keyboardType = 'default', autoCapitalize = 'sentences', error = '', maxLength }) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#7F8794"
        multiline={multiline}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        maxLength={maxLength}
        style={[styles.input, multiline && styles.inputMultiline, error ? styles.inputError : null]}
      />
      {error ? <Text style={styles.errorText}>⚠ {error}</Text> : null}
    </View>
  );
}

function ImageThumb({ img, index, onRemove }) {
  return (
    <View style={styles.imageThumbWrap}>
      <Image source={{ uri: img.uri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.50)']}
        style={[StyleSheet.absoluteFill, { top: '55%' }]}
        pointerEvents="none"
      />
      {index === 0 && (
        <View style={styles.coverBadge}>
          <Text style={styles.coverBadgeText}>Cover</Text>
        </View>
      )}
      <View style={styles.indexBadge}>
        <Text style={styles.indexBadgeText}>{index + 1}</Text>
      </View>
      <Pressable onPress={() => onRemove(index)} style={styles.removeImageBtn} hitSlop={6}>
        <Text style={styles.removeImageBtnText}>✕</Text>
      </Pressable>
    </View>
  );
}

export default function UploadAppScreen({ navigation, route }) {
  const { refreshApps }     = useMarketplace();
  const { addNotification } = useNotifications();

  const isAdmin = route?.params?.isAdmin === true;

  const [form,         setForm]         = useState(initialForm);
  const [errors,       setErrors]       = useState(initialErrors);
  const [pickingImage, setPickingImage] = useState(false);
  const [loading,      setLoading]      = useState(false);

  const updateField = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  };

  // ✅ One image at a time — with crop editor (drag/pinch to choose area)
  const pickOneWithCrop = async () => {
    if (form.images.length >= 5) {
      Alert.alert('Max 5 images', 'Remove an image before adding more.');
      return;
    }
    try {
      setPickingImage(true);
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) { Alert.alert('Permission Required', 'Please allow photo library access.'); return; }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,   // ✅ crop UI opens automatically
        aspect: [4, 3],        // crop ratio — 4:3 suits app screenshots
        quality: 0.88,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const a = result.assets[0];
        setForm(prev => ({
          ...prev,
          images: [...prev.images, { uri: a.uri, width: a.width, height: a.height }],
        }));
        setErrors(prev => ({ ...prev, images: '' }));
      }
    } catch { Alert.alert('Error', 'Unable to select image.'); }
    finally { setPickingImage(false); }
  };

  // ✅ Multiple images at once — no crop (user's choice)
  const pickMultipleNoCrop = async () => {
    if (form.images.length >= 5) {
      Alert.alert('Max 5 images', 'Remove an image before adding more.');
      return;
    }
    try {
      setPickingImage(true);
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) { Alert.alert('Permission Required', 'Please allow photo library access.'); return; }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        allowsEditing: false,
        quality: 0.88,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const remaining  = 5 - form.images.length;
        const newImages  = result.assets.slice(0, remaining).map(a => ({
          uri: a.uri, width: a.width, height: a.height,
        }));
        setForm(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
        setErrors(prev => ({ ...prev, images: '' }));
      }
    } catch { Alert.alert('Error', 'Unable to select images.'); }
    finally { setPickingImage(false); }
  };

  const removeImage = index => updateField('images', form.images.filter((_, i) => i !== index));

  const validate = () => {
    const e = { ...initialErrors };
    let ok = true;
    if (!form.title.trim())       { e.title = 'App title is required'; ok = false; }
    if (!form.category)           { e.category = 'Please select a category'; ok = false; }
    if (!form.description.trim()) { e.description = 'Description is required'; ok = false; }
    if (!form.price.trim())       { e.price = 'Price is required'; ok = false; }
    else if (isNaN(Number(form.price)) || Number(form.price) < 0) { e.price = 'Enter a valid positive number'; ok = false; }
    if (!form.ownerName.trim())   { e.ownerName = 'Owner name is required'; ok = false; }
    if (!form.ownerEmail.trim())  { e.ownerEmail = 'Owner email is required'; ok = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.ownerEmail.trim())) { e.ownerEmail = 'Enter a valid email'; ok = false; }
    if (!form.ownerPhone.trim())  { e.ownerPhone = 'Phone number is required'; ok = false; }
    else if (!/^[0-9]{10}$/.test(form.ownerPhone.trim())) { e.ownerPhone = 'Phone must be exactly 10 digits'; ok = false; }
    if (form.images.length === 0) { e.images = 'Upload at least one image'; ok = false; }
    setErrors(e);
    return ok;
  };

  const handleSubmit = async () => {
    if (!validate()) { Alert.alert('Validation Error', 'Please fix the errors before submitting.'); return; }
    try {
      setLoading(true);
      if (isAdmin) {
        await uploadAppDirectApi(form);
        await refreshApps();
        Alert.alert('✅ Published!', `"${form.title}" is now live in the marketplace.`,
          [{ text: 'Go to Admin Home', onPress: () => navigation.navigate('AdminHome') }]);
      } else {
        await uploadAppApi(form);
        addNotification(`New App Submitted: ${form.title}`,
          `"${form.title}" has been sent for admin approval.`, 'info');
        Alert.alert('✅ Submitted', 'App sent to admin for approval. It will be visible after approval.',
          [{ text: 'Go to Home', onPress: () => navigation.navigate('Home') }]);
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Upload failed. Try again.');
    } finally { setLoading(false); }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>

          {isAdmin && (
            <View style={styles.adminBanner}>
              <LinearGradient
                colors={['rgba(168,85,247,0.18)', 'rgba(126,34,206,0.08)']}
                style={styles.adminBannerGradient}
              >
                <Text style={styles.adminBannerIcon}>⚙</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.adminBannerTitle}>Admin Upload</Text>
                  <Text style={styles.adminBannerText}>This app will be published directly — no approval needed.</Text>
                </View>
              </LinearGradient>
            </View>
          )}

          <Text style={styles.eyebrow}>{isAdmin ? 'ADMIN PUBLISH' : 'UPLOAD APP'}</Text>
          <Text style={styles.title}>{isAdmin ? 'Publish App Directly' : 'Submit Your App'}</Text>
          <Text style={styles.subtitle}>
            {isAdmin
              ? 'Fill in the details below. This app will go live immediately.'
              : 'Fill in the details below. Submitted apps appear after approval.'}
          </Text>

          <View style={styles.card}>

            <Text style={styles.sectionTitle}>App Images</Text>
            <Text style={styles.sectionSubtitle}>
              Crop each image to pick the best area, or add multiple at once. First image = cover.
            </Text>

            {/* Crop tip */}
            <View style={styles.cropTipRow}>
              <Text style={styles.cropTipIcon}>✂️</Text>
              <Text style={styles.cropTipText}>
                Use "Select & Crop" to open the crop editor and drag to pick the important area of each image.
              </Text>
            </View>

            {/* Grid */}
            {form.images.length > 0 && (
              <View style={styles.imageGrid}>
                {form.images.map((img, index) => (
                  <ImageThumb key={`${img.uri}-${index}`} img={img} index={index} onRemove={removeImage} />
                ))}
                {form.images.length < 5 && (
                  <Pressable
                    onPress={pickOneWithCrop}
                    style={({ pressed }) => [styles.addMoreThumb, pressed && styles.pressed]}
                  >
                    <Text style={styles.addMoreIcon}>＋</Text>
                    <Text style={styles.addMoreText}>Crop & Add</Text>
                    <Text style={styles.addMoreCount}>{form.images.length}/5</Text>
                  </Pressable>
                )}
              </View>
            )}

            {/* Empty state */}
            {form.images.length === 0 && (
              <Pressable
                onPress={pickOneWithCrop}
                style={({ pressed }) => [
                  styles.emptyImagePicker,
                  errors.images ? styles.imagePickerError : null,
                  pressed && styles.pressed,
                ]}
              >
                <LinearGradient
                  colors={['rgba(103,232,240,0.08)', 'rgba(255,255,255,0.03)']}
                  style={styles.emptyImagePickerGradient}
                >
                  <View style={styles.uploadIconCircle}>
                    <Text style={styles.uploadPlaceholderIcon}>✂️</Text>
                  </View>
                  <Text style={styles.uploadPlaceholderTitle}>Select & Crop Image</Text>
                  <Text style={styles.uploadPlaceholderText}>
                    Tap to pick an image and drag to crop the area you want
                  </Text>
                  <View style={styles.uploadHintRow}>
                    <Text style={styles.uploadHint}>JPG · PNG · WEBP</Text>
                    <View style={styles.uploadHintDot} />
                    <Text style={styles.uploadHint}>Up to 5 images</Text>
                  </View>
                </LinearGradient>
              </Pressable>
            )}

            {errors.images ? <Text style={[styles.errorText, { marginTop: 6 }]}>⚠ {errors.images}</Text> : null}

            {/* Action buttons */}
            <View style={styles.imageActionsRow}>
              {form.images.length < 5 && (
                <Pressable
                  onPress={pickOneWithCrop}
                  disabled={pickingImage}
                  style={({ pressed }) => [styles.cropActionBtn, pressed && styles.pressed]}
                >
                  <Text style={styles.cropActionBtnText}>
                    {pickingImage ? 'Opening...' : '✂️  Select & Crop'}
                  </Text>
                </Pressable>
              )}
              {form.images.length < 5 && (
                <Pressable
                  onPress={pickMultipleNoCrop}
                  disabled={pickingImage}
                  style={({ pressed }) => [styles.secondaryActionBtn, pressed && styles.pressed]}
                >
                  <Text style={styles.secondaryActionBtnText}>
                    {`📂  Add Multiple (${form.images.length}/5)`}
                  </Text>
                </Pressable>
              )}
              {form.images.length > 0 && (
                <Pressable
                  onPress={() => updateField('images', [])}
                  style={({ pressed }) => [styles.removeActionBtn, pressed && styles.pressed]}
                >
                  <Text style={styles.removeActionBtnText}>Clear</Text>
                </Pressable>
              )}
            </View>

            {form.images.length > 0 && (
              <View style={styles.imageCountRow}>
                {form.images.map((_, i) => (
                  <View key={i} style={[styles.imageCountDot, i === 0 && styles.imageCountDotActive]} />
                ))}
                <Text style={styles.imageCountText}>
                  {form.images.length} image{form.images.length !== 1 ? 's' : ''} selected
                </Text>
              </View>
            )}

            {/* Form fields */}
            <Field label="App Title *" value={form.title}
              onChangeText={t => updateField('title', t)}
              placeholder="Enter app title" error={errors.title} />

            <View style={styles.fieldWrap}>
              <Text style={styles.label}>Category *</Text>
              <View style={styles.categoryRow}>
                {CATEGORIES.map(cat => (
                  <Pressable key={cat} onPress={() => updateField('category', cat)}
                    style={({ pressed }) => [styles.categoryChip, form.category === cat && styles.categoryChipActive, pressed && styles.pressed]}>
                    <Text style={[styles.categoryChipText, form.category === cat && styles.categoryChipTextActive]}>{cat}</Text>
                  </Pressable>
                ))}
              </View>
              {errors.category ? <Text style={styles.errorText}>⚠ {errors.category}</Text> : null}
            </View>

            <Field label="Description *" value={form.description} onChangeText={t => updateField('description', t)} placeholder="Enter app description" multiline error={errors.description} />
            <Field label="Price (₹) *" value={form.price} onChangeText={t => updateField('price', t.replace(/[^0-9.]/g, ''))} placeholder="e.g. 49999" keyboardType="numeric" error={errors.price} />
            <Field label="Owner Name *" value={form.ownerName} onChangeText={t => updateField('ownerName', t)} placeholder="Enter owner name" error={errors.ownerName} />
            <Field label="Owner Email *" value={form.ownerEmail} onChangeText={t => updateField('ownerEmail', t)} placeholder="owner@example.com" keyboardType="email-address" autoCapitalize="none" error={errors.ownerEmail} />
            <Field label="Owner Phone * (10 digits)" value={form.ownerPhone} onChangeText={t => updateField('ownerPhone', t.replace(/[^0-9]/g, ''))} placeholder="10-digit mobile number" keyboardType="phone-pad" maxLength={10} error={errors.ownerPhone} />
            <Field label="Company" value={form.company} onChangeText={t => updateField('company', t)} placeholder="Enter company name" error={errors.company} />
            <Field label="Features" value={form.features} onChangeText={t => updateField('features', t)} placeholder="Enter key features" multiline error={errors.features} />

            <Pressable style={styles.submitBtnWrap} onPress={handleSubmit} disabled={loading}>
              <LinearGradient
                colors={isAdmin ? ['#A855F7', '#7E22CE'] : ['#67E6E8', '#42DDE2', '#1FCFD6']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.submitBtn}
              >
                <Text style={styles.submitBtnText}>
                  {loading ? (isAdmin ? 'Publishing...' : 'Submitting...') : (isAdmin ? '⚡ Publish Now' : 'Submit App')}
                </Text>
              </LinearGradient>
            </Pressable>

            <Pressable style={styles.cancelBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pressed:        { opacity: 0.88 },
  safeArea:       { flex: 1, backgroundColor: COLORS.background },
  container:      { flexGrow: 1, paddingHorizontal: 18, paddingTop: 10, paddingBottom: 40 },
  adminBanner:         { marginBottom: 14 },
  adminBannerGradient: { borderRadius: 16, borderWidth: 1, borderColor: 'rgba(168,85,247,0.28)', paddingHorizontal: 14, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
  adminBannerIcon:     { fontSize: 22 },
  adminBannerTitle:    { color: '#C084FC', fontSize: 13, fontWeight: '800', marginBottom: 3 },
  adminBannerText:     { color: 'rgba(255,255,255,0.60)', fontSize: 11, lineHeight: 16 },
  eyebrow:        { color: '#67E6E8', fontSize: 10, fontWeight: '700', letterSpacing: 1, marginBottom: 6 },
  title:          { color: '#FFFFFF', fontSize: 28, fontWeight: '800', marginBottom: 8 },
  subtitle:       { color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 20, marginBottom: 18 },
  card:           { backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 22, padding: 16 },
  sectionTitle:   { color: '#FFFFFF', fontSize: 15, fontWeight: '800', marginBottom: 4 },
  sectionSubtitle:{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 10 },
  cropTipRow:     { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: 'rgba(103,232,240,0.07)', borderWidth: 1, borderColor: 'rgba(103,232,240,0.18)', borderRadius: 12, padding: 10, marginBottom: 14 },
  cropTipIcon:    { fontSize: 14, lineHeight: 20 },
  cropTipText:    { flex: 1, color: 'rgba(255,255,255,0.65)', fontSize: 11, lineHeight: 17 },
  imageGrid:      { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12 },
  imageThumbWrap: { width: THUMB_W, height: THUMB_H, borderRadius: 14, overflow: 'hidden', position: 'relative', backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)' },
  coverBadge:     { position: 'absolute', top: 8, left: 8, backgroundColor: 'rgba(103,232,240,0.92)', borderRadius: 999, paddingHorizontal: 9, paddingVertical: 4 },
  coverBadgeText: { color: '#0A2A2B', fontSize: 9, fontWeight: '800' },
  indexBadge:     { position: 'absolute', bottom: 8, left: 8, width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(0,0,0,0.62)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.22)' },
  indexBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800' },
  removeImageBtn: { position: 'absolute', top: 8, right: 8, width: 26, height: 26, borderRadius: 13, backgroundColor: 'rgba(255,50,80,0.88)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.22)' },
  removeImageBtnText: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },
  addMoreThumb:   { width: THUMB_W, height: THUMB_H, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1.5, borderColor: 'rgba(103,232,240,0.28)', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', gap: 4 },
  addMoreIcon:    { color: '#67E6E8', fontSize: 28, fontWeight: '300', lineHeight: 32 },
  addMoreText:    { color: 'rgba(255,255,255,0.70)', fontSize: 11, fontWeight: '700' },
  addMoreCount:   { color: 'rgba(103,232,240,0.70)', fontSize: 10, fontWeight: '600' },
  emptyImagePicker:         { borderRadius: 18, overflow: 'hidden', marginBottom: 10, borderWidth: 1.5, borderColor: 'rgba(103,232,240,0.20)', borderStyle: 'dashed' },
  imagePickerError:          { borderColor: '#FF5252' },
  emptyImagePickerGradient: { paddingVertical: 32, alignItems: 'center' },
  uploadIconCircle:         { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(103,232,240,0.12)', borderWidth: 1, borderColor: 'rgba(103,232,240,0.28)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  uploadPlaceholderIcon:    { fontSize: 22 },
  uploadPlaceholderTitle:   { color: '#FFFFFF', fontSize: 15, fontWeight: '800', marginBottom: 6 },
  uploadPlaceholderText:    { color: 'rgba(255,255,255,0.55)', fontSize: 13, textAlign: 'center', marginBottom: 12, paddingHorizontal: 20 },
  uploadHintRow:            { flexDirection: 'row', alignItems: 'center', gap: 8 },
  uploadHint:               { color: 'rgba(255,255,255,0.30)', fontSize: 11, fontWeight: '600' },
  uploadHintDot:            { width: 3, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.20)' },
  imageActionsRow:       { flexDirection: 'row', gap: 8, marginBottom: 6, flexWrap: 'wrap' },
  cropActionBtn:         { flex: 1, minHeight: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(103,232,240,0.12)', borderWidth: 1, borderColor: 'rgba(103,232,240,0.28)' },
  cropActionBtnText:     { color: '#67E6E8', fontSize: 12, fontWeight: '800' },
  secondaryActionBtn:    { flex: 1, minHeight: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  secondaryActionBtnText:{ color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  removeActionBtn:       { minWidth: 72, minHeight: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,80,80,0.10)', borderWidth: 1, borderColor: 'rgba(255,80,80,0.24)', paddingHorizontal: 12 },
  removeActionBtnText:   { color: '#FF5252', fontSize: 12, fontWeight: '700' },
  imageCountRow:       { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16, marginTop: 4 },
  imageCountDot:       { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.25)' },
  imageCountDotActive: { backgroundColor: '#67E6E8', width: 14 },
  imageCountText:      { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '600', marginLeft: 4 },
  categoryRow:           { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 4 },
  categoryChip:          { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)' },
  categoryChipActive:    { backgroundColor: 'rgba(103,232,240,0.16)', borderColor: 'rgba(66,221,226,0.40)' },
  categoryChipText:      { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '600' },
  categoryChipTextActive:{ color: '#67E6E8', fontWeight: '800' },
  fieldWrap:      { marginBottom: 14 },
  label:          { color: '#FFFFFF', fontSize: 13, fontWeight: '700', marginBottom: 8 },
  input:          { minHeight: 50, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.04)', paddingHorizontal: 14, color: '#FFFFFF', fontSize: 14 },
  inputMultiline: { minHeight: 110, textAlignVertical: 'top', paddingTop: 14 },
  inputError:     { borderColor: '#FF5252' },
  errorText:      { color: '#FF5252', fontSize: 12, marginTop: 4, fontWeight: '600' },
  submitBtnWrap:  { borderRadius: 16, overflow: 'hidden', marginTop: 4, marginBottom: 12, elevation: 6 },
  submitBtn:      { minHeight: 52, alignItems: 'center', justifyContent: 'center' },
  submitBtnText:  { color: '#12343A', fontSize: 15, fontWeight: '800' },
  cancelBtn:      { minHeight: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  cancelBtnText:  { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});