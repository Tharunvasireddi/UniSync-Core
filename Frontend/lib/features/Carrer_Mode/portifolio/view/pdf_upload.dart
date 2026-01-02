import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'dart:io';

import 'package:unisync/constants/constant.dart';

class PdfUpload extends StatefulWidget {
  const PdfUpload({super.key});

  @override
  State<PdfUpload> createState() => _PdfUploadScreenState();
}

class _PdfUploadScreenState extends State<PdfUpload> {
  PlatformFile? selectedFile;
  bool uploading = false;

  final Dio dio = Dio(
    BaseOptions(
      baseUrl: "$BASE_URI/resume/upload-document",
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
    ),
  );

  Future<void> pickPdf() async {
    try {
      final result = await FilePicker.platform.pickFiles(
        type: FileType.custom,
        allowedExtensions: ['pdf'],
        allowMultiple: false,
      );

      if (result == null || result.files.isEmpty) return;

      setState(() {
        selectedFile = result.files.single;
      });
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Error picking file: $e")),
      );
    }
  }

  Future<void> uploadPdf() async {
    if (selectedFile == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Please select a PDF first")),
      );
      return;
    }

    // Check if path exists (required for mobile/desktop)
    if (selectedFile!.path == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("File path not available")),
      );
      return;
    }

    setState(() => uploading = true);

    try {
      // Create multipart file from the selected file
      final formData = FormData.fromMap({
        'pdf': await MultipartFile.fromFile(
          selectedFile!.path!,
          filename: selectedFile!.name,
        ),
      });

      // Send POST request
      final response = await dio.post(
        "/upload",
        data: formData,
        options: Options(
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        ),
        onSendProgress: (sent, total) {
          // Optional: Show upload progress
          print('Upload progress: ${(sent / total * 100).toStringAsFixed(0)}%');
        },
      );

      if (!mounted) return;
      
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("PDF uploaded successfully"),
          backgroundColor: Colors.green,
        ),
      );

      // Optional: Clear selection after successful upload
      setState(() {
        selectedFile = null;
      });

    } on DioException catch (e) {
      if (!mounted) return;
      
      String errorMessage = "Upload failed";
      
      if (e.type == DioExceptionType.connectionTimeout) {
        errorMessage = "Connection timeout - check your server";
      } else if (e.type == DioExceptionType.connectionError) {
        errorMessage = "Connection error - check server URL";
      } else if (e.response != null) {
        errorMessage = "Server error: ${e.response?.statusCode}";
      } else {
        errorMessage = "Error: ${e.message}";
      }
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(errorMessage),
          backgroundColor: Colors.red,
        ),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("Unexpected error: $e"),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      if (mounted) {
        setState(() => uploading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Upload PDF"),
        centerTitle: true,
        elevation: 0,
      ),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                border: Border.all(
                  color: selectedFile != null 
                      ? Colors.blue.shade300 
                      : Colors.grey.shade300,
                  width: 2,
                ),
                borderRadius: BorderRadius.circular(12),
                color: selectedFile != null 
                    ? Colors.blue.shade50 
                    : Colors.grey.shade50,
              ),
              child: Column(
                children: [
                  Icon(
                    Icons.picture_as_pdf,
                    size: 60,
                    color: selectedFile != null 
                        ? Colors.blue 
                        : Colors.grey,
                  ),
                  const SizedBox(height: 12),
                  Text(
                    selectedFile?.name ?? "No file selected",
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: selectedFile != null 
                          ? FontWeight.w500 
                          : FontWeight.normal,
                    ),
                  ),
                  if (selectedFile != null) ...[
                    const SizedBox(height: 8),
                    Text(
                      "${(selectedFile!.size / 1024).toStringAsFixed(2)} KB",
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey.shade600,
                      ),
                    ),
                  ],
                ],
              ),
            ),

            const SizedBox(height: 24),

            SizedBox(
              width: double.infinity,
              height: 48,
              child: OutlinedButton.icon(
                onPressed: uploading ? null : pickPdf,
                icon: const Icon(Icons.file_open),
                label: const Text("Pick PDF"),
              ),
            ),

            const SizedBox(height: 12),

            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton.icon(
                onPressed: (uploading || selectedFile == null) ? null : uploadPdf,
                icon: uploading
                    ? const SizedBox(
                        height: 18,
                        width: 18,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: Colors.white,
                        ),
                      )
                    : const Icon(Icons.upload),
                label: Text(uploading ? "Uploading..." : "Upload"),
              ),
            ),
          ],
        ),
      ),
    );
  }
}