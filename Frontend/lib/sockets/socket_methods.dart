
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:unisync/sockets/socket_client.dart';

final roomProvider =  StateProvider<Map<String,dynamic>?>((ref) {
  return null;
});

final socketMethodProvider = StateProvider((ref) => SocketMethods(ref: ref));

class SocketMethods {
  final Ref ref;
  SocketMethods({required this.ref});
  final socket = SocketClient.instance.socket;

  void startInterview(String templateId, String userId) {
    print('Starting interview with templateId: $templateId and userId: $userId');
    socket!.emit("startInterview", {
      'templateId' : templateId,
      'userId' : userId,
    });
  }

  void interviewQuestionListener(BuildContext context) {
    socket!.on("questionAsked", (data) {
      print("Question asked data from backend is $data");
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("New Question: ${data}"),
        ),
      );
    });
  }


  void createRoom(String name) {
    socket!.emit("createRoom",name);
  }


  void roomCreateListn() {
    socket!.on("createRoomSucess", (room) {
      print("The room value from the backend is $room");
      ref.read(roomProvider.notifier).state = room;
      // Navigator.pushNamed(context, "/gameRoom");
    });
  }

  void JoinRoom(String roomId, String name) {
    socket!.emit("joinRoom", {
      'nickname' : name,
      'roomId' : roomId,
    });
  }

  void joinRoomSucessListeners() {
    socket!.on("joinRoomSucessListener", (room) {
      print(room.toString());
      ref.read(roomProvider.notifier).state = room;
    });
  }





}
