import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Mail, Phone, MessageSquare, RefreshCw, Eye, Send, Reply, Upload, Trash2, Image, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface HelpMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface GalleryPhoto {
  id: string;
  title: string | null;
  description: string | null;
  url: string;
  file_path: string;
  category: string;
  created_at: string;
}

const categoryOptions = [
  { value: "events", label: "Events" },
  { value: "sports", label: "Sports" },
  { value: "cultural", label: "Cultural" },
  { value: "academics", label: "Academics" },
  { value: "celebrations", label: "Celebrations" },
  { value: "campus", label: "Campus Life" },
];

export default function AdminDashboard() {
  const [messages, setMessages] = useState<HelpMessage[]>([]);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<HelpMessage | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [photoTitle, setPhotoTitle] = useState("");
  const [photoDescription, setPhotoDescription] = useState("");
  const [photoCategory, setPhotoCategory] = useState("events");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/admin");
      } else if (!isAdmin) {
        toast({
          title: "Access Denied",
          description: "You do not have admin privileges",
          variant: "destructive",
        });
        signOut();
        navigate("/admin");
      }
    }
  }, [user, isAdmin, authLoading, navigate, toast, signOut]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchMessages();
      fetchPhotos();
    }
  }, [user, isAdmin]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("help_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Error",
        description: "Failed to fetch enquiries",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from("gallery_photos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPhotos(data || []);
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchMessages(), fetchPhotos()]);
    setIsRefreshing(false);
    toast({
      title: "Refreshed",
      description: "Data has been updated",
    });
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("help_messages")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === id ? { ...msg, status: newStatus } : msg
        )
      );

      if (selectedMessage?.id === id) {
        setSelectedMessage((prev) => prev ? { ...prev, status: newStatus } : null);
      }

      toast({
        title: "Status Updated",
        description: `Enquiry marked as ${newStatus}`,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const handleSendReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;

    setIsSendingReply(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-reply-email", {
        body: {
          to_email: selectedMessage.email,
          to_name: selectedMessage.name,
          subject: selectedMessage.subject,
          original_message: selectedMessage.message,
          reply_message: replyText,
        },
      });

      if (error) throw error;

      toast({
        title: "Reply Sent",
        description: `Reply sent to ${selectedMessage.email}`,
      });

      await updateStatus(selectedMessage.id, "in_progress");
      
      setReplyText("");
      setShowReplyForm(false);
    } catch (error) {
      console.error("Error sending reply:", error);
      toast({
        title: "Error",
        description: "Failed to send reply. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    setSelectedFiles(imageFiles);
  };

  const handleUploadPhotos = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one image to upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    let successCount = 0;

    try {
      for (const file of selectedFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `photos/${fileName}`;

        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('gallery')
          .upload(filePath, file);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          continue;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('gallery')
          .getPublicUrl(filePath);

        // Save to database
        const { error: dbError } = await supabase
          .from('gallery_photos')
          .insert({
            title: photoTitle || null,
            description: photoDescription || null,
            url: publicUrl,
            file_path: filePath,
            category: photoCategory as "events" | "sports" | "cultural" | "academics" | "celebrations" | "campus",
            uploaded_by: user?.id,
          });

        if (dbError) {
          console.error("Database error:", dbError);
          // Try to clean up uploaded file
          await supabase.storage.from('gallery').remove([filePath]);
          continue;
        }

        successCount++;
      }

      if (successCount > 0) {
        toast({
          title: "Photos Uploaded",
          description: `Successfully uploaded ${successCount} photo(s)`,
        });
        setSelectedFiles([]);
        setPhotoTitle("");
        setPhotoDescription("");
        setPhotoCategory("events");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        fetchPhotos();
      } else {
        toast({
          title: "Upload Failed",
          description: "Could not upload any photos. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error uploading photos:", error);
      toast({
        title: "Error",
        description: "Failed to upload photos",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeletePhoto = async (photo: GalleryPhoto) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('gallery')
        .remove([photo.file_path]);

      if (storageError) {
        console.error("Storage delete error:", storageError);
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('gallery_photos')
        .delete()
        .eq('id', photo.id);

      if (dbError) throw dbError;

      setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
      toast({
        title: "Photo Deleted",
        description: "Photo has been removed from the gallery",
      });
    } catch (error) {
      console.error("Error deleting photo:", error);
      toast({
        title: "Error",
        description: "Failed to delete photo",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/admin");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleCloseDialog = () => {
    setSelectedMessage(null);
    setShowReplyForm(false);
    setReplyText("");
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const pendingCount = messages.filter((m) => m.status === "pending").length;
  const inProgressCount = messages.filter((m) => m.status === "in_progress").length;
  const resolvedCount = messages.filter((m) => m.status === "resolved").length;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-primary-foreground/80">
                Dunne's Institute Management
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing} className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button
                variant="outline"
                className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="enquiries" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="enquiries" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Enquiries
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Gallery
            </TabsTrigger>
          </TabsList>

          {/* Enquiries Tab */}
          <TabsContent value="enquiries" className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-foreground">{messages.length}</div>
                  <p className="text-muted-foreground text-sm">Total Enquiries</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
                  <p className="text-muted-foreground text-sm">Pending</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-blue-600">{inProgressCount}</div>
                  <p className="text-muted-foreground text-sm">In Progress</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-green-600">{resolvedCount}</div>
                  <p className="text-muted-foreground text-sm">Resolved</p>
                </CardContent>
              </Card>
            </div>

            {/* Enquiries Table */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Enquiries</CardTitle>
                <CardDescription>Manage and respond to website enquiries</CardDescription>
              </CardHeader>
              <CardContent>
                {messages.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No enquiries yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {messages.map((message) => (
                          <TableRow key={message.id}>
                            <TableCell className="text-sm text-muted-foreground">
                              {format(new Date(message.created_at), "MMM d, yyyy")}
                            </TableCell>
                            <TableCell className="font-medium">{message.name}</TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              {message.subject}
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(message.status)}>
                                {message.status.replace("_", " ")}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedMessage(message)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="space-y-6">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Photos
                </CardTitle>
                <CardDescription>Add new photos to the gallery</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="photo-title">Title (optional)</Label>
                    <Input
                      id="photo-title"
                      placeholder="Photo title"
                      value={photoTitle}
                      onChange={(e) => setPhotoTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="photo-description">Description (optional)</Label>
                    <Input
                      id="photo-description"
                      placeholder="Photo description"
                      value={photoDescription}
                      onChange={(e) => setPhotoDescription(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="photo-category">Category</Label>
                    <Select value={photoCategory} onValueChange={setPhotoCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="photo-files">Select Images</Label>
                  <Input
                    ref={fileInputRef}
                    id="photo-files"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="cursor-pointer"
                  />
                  {selectedFiles.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {selectedFiles.length} file(s) selected
                    </p>
                  )}
                </div>
                <Button 
                  onClick={handleUploadPhotos} 
                  disabled={isUploading || selectedFiles.length === 0}
                  className="w-full md:w-auto"
                >
                  {isUploading ? (
                    "Uploading..."
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Photos
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Photos Grid */}
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Gallery Photos ({photos.length})</CardTitle>
                <CardDescription>Manage gallery photos</CardDescription>
              </CardHeader>
              <CardContent>
                {photos.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Image className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No photos in the gallery yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {photos.map((photo) => (
                      <div key={photo.id} className="relative group aspect-square rounded-lg overflow-hidden bg-muted">
                        <img
                          src={photo.url}
                          alt={photo.title || "Gallery photo"}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeletePhoto(photo)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                        {photo.title && (
                          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                            <p className="text-white text-sm truncate">{photo.title}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Message Detail Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">{selectedMessage?.subject}</DialogTitle>
            <DialogDescription>
              Received on {selectedMessage && format(new Date(selectedMessage.created_at), "MMMM d, yyyy 'at' h:mm a")}
            </DialogDescription>
          </DialogHeader>
          
          {selectedMessage && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">Name:</span>
                  <span>{selectedMessage.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${selectedMessage.email}`} className="text-primary hover:underline">
                    {selectedMessage.email}
                  </a>
                </div>
                {selectedMessage.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${selectedMessage.phone}`} className="text-primary hover:underline">
                      {selectedMessage.phone}
                    </a>
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-medium mb-2">Message</h4>
                <div className="bg-muted/50 rounded-lg p-4 text-sm whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Reply Section */}
              {!showReplyForm ? (
                <Button 
                  onClick={() => setShowReplyForm(true)}
                  className="w-full"
                  variant="outline"
                >
                  <Reply className="h-4 w-4 mr-2" />
                  Reply to Enquiry
                </Button>
              ) : (
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-medium">Send Reply</h4>
                  <Textarea
                    placeholder="Type your reply here..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={5}
                    className="resize-none"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSendReply}
                      disabled={!replyText.trim() || isSendingReply}
                      className="flex-1"
                    >
                      {isSendingReply ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Reply
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowReplyForm(false);
                        setReplyText("");
                      }}
                      disabled={isSendingReply}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 pt-4 border-t">
                <span className="text-sm font-medium">Update Status:</span>
                <Select
                  value={selectedMessage.status}
                  onValueChange={(value) => updateStatus(selectedMessage.id, value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}