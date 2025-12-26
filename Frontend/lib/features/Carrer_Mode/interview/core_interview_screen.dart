import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:unisync/sockets/socket_methods.dart';

class CoreInterviewScreen extends ConsumerStatefulWidget {
  const CoreInterviewScreen({super.key});

  @override
  ConsumerState<CoreInterviewScreen> createState() => _CoreInterviewScreenState();
}

class _CoreInterviewScreenState extends ConsumerState<CoreInterviewScreen> {

  
  @override
  void initState() {
    super.initState();
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black45,
      appBar: AppBar(
        leading: IconButton(
          icon: Icon(Icons.exit_to_app_sharp, color: Colors.black),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
      ),
      body: SafeArea(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            Center(
              child: CircleAvatar(
                radius: 80,
                backgroundImage: NetworkImage(
                    'https://example.com/ai_avatar.png'),
              ),
            ),
          
            Center(
              child: ElevatedButton(
                onPressed: () {
                  // Handle mic button press
                },
                style: ElevatedButton.styleFrom(
                  shape: CircleBorder(),
                  padding: EdgeInsets.all(24),
                ),
                child: Icon(
                  Icons.mic,
                  size: 48,
                  color: Colors.white,
                ),
              ),
            ),
            
          ],
        ),
      )
    );
  }
}