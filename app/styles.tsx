import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  content_container: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 8,
    marginBottom: 8,
    padding: 16,
    borderRadius: 16,
    filter: 'drop-shadow(4px 4px 4px rgba(0, 0, 0, 0.35))',
    backgroundColor: '#9B41E9',
    width: '95%',
    justifyContent: "center",
    alignItems: "center",
  },
  navheader_container: {
    paddingTop: '10%',
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container_header_text: {
    fontSize: 18,
    color: "#ffffff",
    fontFamily: 'Poppins_300Light',
  },
  container_button_text: {
    fontSize: 24,
    color: "#ffffff",
    fontFamily: 'Poppins_500Medium',
  },
  header_text: {
    fontSize: 24,
    color: "#000000",
    fontFamily: 'Poppins_500Medium',
  },
  timer_progress_text: {
    fontSize: 32,
    color: "#121212",
    fontFamily: 'Poppins_400Regular',
  },
  timer_progress_text_large: {
    fontSize: 48,
    color: "#121212",
    fontFamily: 'Poppins_400Regular',
  },
});